import assert from "node:assert/strict";
import mongoose from "mongoose";
import { createTRPCUntypedClient, httpBatchLink } from "@trpc/client";

const baseUrl = process.env.CRUD_TEST_BASE_URL ?? "http://127.0.0.1:3201";
const databaseUri = process.env.TEST_DATABASE_URL;
const appDatabaseUri = process.env.MONGODB_URI;
if (!databaseUri) {
  throw new Error("Set TEST_DATABASE_URL to a disposable loopback MongoDB database.");
}
if (!appDatabaseUri || appDatabaseUri !== databaseUri) {
  throw new Error("Refusing to run: MONGODB_URI must exactly match the isolated TEST_DATABASE_URL used by the app.");
}

const parsedDatabaseUri = new URL(databaseUri);
const databaseName = parsedDatabaseUri.pathname.slice(1);
const parsedBaseUrl = new URL(baseUrl);
if (
  !["127.0.0.1", "localhost", "::1"].includes(parsedDatabaseUri.hostname) ||
  !/^portfolio_crud_test_[a-z0-9_-]+$/i.test(databaseName) ||
  !["127.0.0.1", "localhost", "::1"].includes(parsedBaseUrl.hostname)
) {
  throw new Error("Refusing to run: app and test database must both use loopback hosts, and the database name must be portfolio_crud_test_<unique-suffix>.");
}

const marker = `CRUD_TEST_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
const ids = { lead: null, project: null, blog: null };
let sessionCookie = "";

const client = createTRPCUntypedClient({
  links: [
    httpBatchLink({
      url: `${baseUrl}/api/trpc`,
      fetch: async (input, init) => {
        const headers = new Headers(init?.headers);
        if (sessionCookie) headers.set("cookie", sessionCookie);
        const response = await fetch(input, { ...init, headers });
        const setCookies = response.headers.getSetCookie?.() ?? [];
        const session = setCookies.find((cookie) => cookie.startsWith("portfolio_admin="));
        if (session) sessionCookie = session.split(";", 1)[0];
        return response;
      },
    }),
  ],
});

function expectValidationFailure(promise, label) {
  return assert.rejects(promise, (error) => {
    assert.ok(error, `${label} should be rejected`);
    assert.equal(error.data?.code, "BAD_REQUEST", `${label} should be rejected by backend validation`);
    assert.ok(error.data?.zodError, `${label} should include structured Zod field errors`);
    return true;
  });
}

async function expectNotFound(promise, label) {
  await assert.rejects(promise, (error) => {
    assert.ok(error.data?.code === "NOT_FOUND" || /not found/i.test(error.message), `${label} should be not found`);
    return true;
  });
}

async function responseText(path) {
  const response = await fetch(new URL(path, baseUrl), { cache: "no-store" });
  return { response, text: await response.text() };
}

async function persisted(collection, id, label) {
  const record = await mongoose.connection.collection(collection).findOne({ _id: new mongoose.Types.ObjectId(id) });
  assert.ok(record, `${label} should be present in MongoDB`);
  return record;
}

async function main() {
  await mongoose.connect(databaseUri, { serverSelectionTimeoutMS: 5000 });
  try {
    const server = await fetch(baseUrl);
    assert.equal(server.status, 200, "app server should respond");

    await client.mutation("auth.login", {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    assert.ok(sessionCookie, "login should return an admin session cookie");

    const leadInput = {
      name: "CRUD Test Contact",
      email: `${marker.toLowerCase()}@example.invalid`,
      phone: "+91 98765 43210",
      company: marker,
      service: "SaaS Product",
      budget: "To be discussed",
      timeline: "1–3 months",
      message: `${marker}: test lead for isolated CRUD persistence verification.`,
      source: "direct",
      landingPage: "/contact",
      referrer: "https://example.invalid/",
      utmSource: marker,
    };

    await expectValidationFailure(client.mutation("contact.send", { ...leadInput, email: "bad" }), "invalid lead email");
    const leadWithoutName = { ...leadInput };
    delete leadWithoutName.name;
    await expectValidationFailure(client.mutation("contact.send", leadWithoutName), "missing lead name");
    await expectValidationFailure(client.mutation("contact.send", { ...leadInput, message: "" }), "empty lead message");
    await expectValidationFailure(client.mutation("contact.send", { ...leadInput, service: "unknown" }), "invalid lead service");
    await expectValidationFailure(client.mutation("contact.send", { ...leadInput, budget: "unknown" }), "invalid lead budget");

    await client.mutation("contact.send", leadInput);
    let inbox = await client.query("contact.inbox");
    let lead = inbox.items.find((item) => item.email === leadInput.email);
    assert.ok(lead, "created lead should appear in the authenticated inbox");
    ids.lead = lead.id;
    assert.equal((await persisted("messages", ids.lead, "lead")).read, false);
    let leadRead = await client.query("contact.getById", { id: ids.lead });
    assert.equal(leadRead.message, leadInput.message);
    lead = await client.mutation("contact.markRead", { id: ids.lead, read: true });
    assert.equal(lead.read, true);
    leadRead = await client.query("contact.getById", { id: ids.lead });
    assert.equal(leadRead.read, true, "lead status should persist on fresh read");
    assert.equal((await persisted("messages", ids.lead, "updated lead")).read, true);
    await client.mutation("contact.delete", { id: ids.lead });
    await expectNotFound(client.query("contact.getById", { id: ids.lead }), "deleted lead");
    assert.equal(await mongoose.connection.collection("messages").findOne({ _id: new mongoose.Types.ObjectId(ids.lead) }), null);
    console.log("LEAD CRUD + invalid-input tests passed.");

    const projectBase = {
      title: `${marker} Project`,
      description: `${marker} initial project description for server rendering.`,
      image: "/images/solar.webp",
      github: "",
      demo: "",
      socialLinks: {},
      isVideo: false,
      technologies: ["Next.js", "MongoDB"],
      highlights: ["isolated CRUD verification"],
      details: `${marker} project details.`,
      role: "Test role",
      projectType: "Test subtype",
      kind: "personal",
      companySlug: "",
      company: "",
      category: "Full Stack",
      published: true,
      order: 0,
    };
    const invalidProjects = [
      ["missing title", (() => { const data = { ...projectBase }; delete data.title; return data; })()],
      ["invalid GitHub URL", { ...projectBase, github: "https://example.invalid/repo" }],
      ["invalid LinkedIn URL", { ...projectBase, socialLinks: { linkedin: "https://example.invalid/profile" } }],
      ["invalid documentation URL", { ...projectBase, documentationUrl: "javascript:alert(1)" }],
      ["empty client name", { ...projectBase, clients: [{ name: "" }] }],
      ["invalid metric", { ...projectBase, impactMetrics: [{ label: "", value: "" }] }],
      ["invalid testimonial", { ...projectBase, testimonials: [{ quote: "short" }] }],
      ["too many metrics", { ...projectBase, impactMetrics: Array.from({ length: 7 }, (_, index) => ({ label: `Metric ${index}`, value: "1" })) }],
      ["too many testimonials", { ...projectBase, testimonials: Array.from({ length: 6 }, (_, index) => ({ quote: `A valid testimonial quote number ${index}.` })) }],
      ["invalid project type", { ...projectBase, kind: "invalid" }],
      ["invalid category", { ...projectBase, category: "unsupported" }],
      ["negative display order", { ...projectBase, order: -1 }],
      ["missing partnership company", { ...projectBase, kind: "partnership", companySlug: "" }],
    ];
    for (const [label, data] of invalidProjects) {
      await expectValidationFailure(client.mutation("project.create", data), `project ${label}`);
    }

    let project = await client.mutation("project.create", projectBase);
    ids.project = project.id;
    assert.deepEqual(project.clients, [], "legacy-shaped projects should default to no clients");
    assert.deepEqual(project.impactMetrics, [], "legacy-shaped projects should default to no impact metrics");
    assert.deepEqual(project.testimonials, [], "legacy-shaped projects should default to no testimonials");
    assert.equal(project.documentationUrl, undefined, "documentation remains optional");
    assert.equal((await persisted("projects", ids.project, "project")).title, projectBase.title);
    let listedProjects = await client.query("project.adminList");
    assert.ok(listedProjects.some((item) => item.id === ids.project), "project should appear in admin API");
    let publicProjects = await client.query("project.getAll", {});
    assert.ok(publicProjects.some((item) => item.id === ids.project), "published project should appear in public API");
    let rendered = await responseText(`/projects/${ids.project}`);
    assert.equal(rendered.response.status, 200);
    assert.ok(rendered.text.includes(projectBase.title) && rendered.text.includes(projectBase.description), "project detail should SSR current values");

    const projectUpdated = {
      ...projectBase,
      title: `${marker} Project Updated`,
      description: `${marker} updated project description verified on a fresh request.`,
      socialLinks: { linkedin: "https://www.linkedin.com/company/crud-test/" },
      documentationUrl: "https://docs.example.com/getting-started",
      clients: [{
        name: `${marker} Verified School`,
        logo: "/images/solar.webp",
        website: "https://school.example.com",
        description: `${marker} verified organization.`,
      }],
      impactMetrics: [{ label: "Schools", value: "25+" }],
      testimonials: [{
        quote: `${marker} verified testimonial quote for persistence.`,
        name: "Test Stakeholder",
        designation: "Administrator",
        organization: `${marker} Verified School`,
        avatar: "/images/solar.webp",
      }],
    };
    project = await client.mutation("project.update", { id: ids.project, ...projectUpdated });
    assert.equal(project.title, projectUpdated.title);
    assert.equal(project.socialLinks.linkedin, projectUpdated.socialLinks.linkedin);
    const persistedUpdatedProject = await persisted("projects", ids.project, "updated project");
    assert.equal(persistedUpdatedProject.description, projectUpdated.description);
    assert.equal(persistedUpdatedProject.documentationUrl, projectUpdated.documentationUrl);
    assert.equal(persistedUpdatedProject.clients[0].name, projectUpdated.clients[0].name);
    assert.equal(persistedUpdatedProject.impactMetrics[0].value, projectUpdated.impactMetrics[0].value);
    assert.equal(persistedUpdatedProject.testimonials[0].quote, projectUpdated.testimonials[0].quote);
    project = await client.query("project.getById", { id: ids.project });
    assert.equal(project.title, projectUpdated.title);
    assert.equal(project.description, projectUpdated.description);
    assert.equal(project.documentationUrl, projectUpdated.documentationUrl);
    assert.deepEqual(project.clients, projectUpdated.clients);
    assert.deepEqual(project.impactMetrics, projectUpdated.impactMetrics);
    assert.deepEqual(project.testimonials, projectUpdated.testimonials);
    rendered = await responseText(`/projects/${ids.project}`);
    assert.equal(rendered.response.status, 200);
    assert.ok(rendered.text.includes(projectUpdated.title) && rendered.text.includes(projectUpdated.description));
    assert.ok(rendered.text.includes(projectUpdated.socialLinks.linkedin), "LinkedIn action should be SSR when present");
    assert.ok(rendered.text.includes(projectUpdated.documentationUrl), "documentation link should be SSR when present");
    assert.ok(rendered.text.includes(projectUpdated.clients[0].name), "client should be SSR when present");
    assert.ok(rendered.text.includes(projectUpdated.impactMetrics[0].value), "impact metric should be SSR when present");
    assert.ok(rendered.text.includes(projectUpdated.testimonials[0].quote), "testimonial should be SSR when present");

    await client.mutation("project.update", {
      id: ids.project,
      ...projectUpdated,
      socialLinks: { linkedin: "" },
    });
    project = await client.query("project.getById", { id: ids.project });
    assert.ok(!project.socialLinks?.linkedin, "empty LinkedIn should be removed after fresh read");
    assert.equal((await persisted("projects", ids.project, "project without LinkedIn")).socialLinks?.linkedin, undefined);

    await client.mutation("project.update", {
      id: ids.project,
      ...projectUpdated,
      documentationUrl: "",
      clients: [],
      impactMetrics: [],
      testimonials: [],
    });
    project = await client.query("project.getById", { id: ids.project });
    assert.equal(project.documentationUrl, undefined, "documentation should be removable");
    assert.deepEqual(project.clients, [], "clients should be removable");
    assert.deepEqual(project.impactMetrics, [], "impact metrics should be removable");
    assert.deepEqual(project.testimonials, [], "testimonials should be removable");

    await client.mutation("project.update", { id: ids.project, ...projectUpdated, published: false });
    publicProjects = await client.query("project.getAll", {});
    assert.ok(!publicProjects.some((item) => item.id === ids.project), "unpublished project must be absent from public API");
    await expectNotFound(client.query("project.getById", { id: ids.project }), "unpublished project detail API");
    rendered = await responseText(`/projects/${ids.project}`);
    assert.equal(rendered.response.status, 404, "unpublished project detail must be not found");
    await client.mutation("project.update", { id: ids.project, ...projectUpdated, published: true });
    rendered = await responseText(`/projects/${ids.project}`);
    assert.equal(rendered.response.status, 200, "republished project should appear on a fresh request");
    assert.ok(rendered.text.includes(projectUpdated.title));

    await client.mutation("project.delete", { id: ids.project });
    assert.ok(!(await client.query("project.adminList")).some((item) => item.id === ids.project));
    await expectNotFound(client.query("project.getById", { id: ids.project }), "deleted project");
    rendered = await responseText(`/projects/${ids.project}`);
    assert.equal(rendered.response.status, 404);
    assert.equal(await mongoose.connection.collection("projects").findOne({ _id: new mongoose.Types.ObjectId(ids.project) }), null);
    console.log("PROJECT CRUD, LinkedIn, publish visibility, SSR, and invalid-input tests passed.");

    const blogBase = {
      title: `${marker} Blog`,
      excerpt: `${marker} short excerpt for isolated integration testing.`,
      content: `${marker} blog content with enough detail to meet the minimum validation length.`,
      image: "",
      tags: ["CRUD", "Test"],
      published: true,
      order: 0,
    };
    const invalidBlogs = [
      ["empty title", { ...blogBase, title: "" }],
      ["invalid slug field", { ...blogBase, slug: "Not a valid slug" }],
      ["empty content", { ...blogBase, content: "" }],
      ["invalid media URL", { ...blogBase, image: "javascript:alert(1)" }],
      ["invalid publication value", { ...blogBase, published: "yes" }],
    ];
    for (const [label, data] of invalidBlogs) {
      await expectValidationFailure(client.mutation("blog.create", data), `blog ${label}`);
    }

    let blog = await client.mutation("blog.create", blogBase);
    ids.blog = blog.id;
    assert.equal((await persisted("blogs", ids.blog, "blog")).title, blogBase.title);
    let listedBlogs = await client.query("blog.adminList");
    assert.ok(listedBlogs.some((item) => item.id === ids.blog), "blog should appear in admin API");
    let publicBlogs = await client.query("blog.getAll");
    assert.ok(publicBlogs.some((item) => item.id === ids.blog), "published blog should appear in public API");
    let blogPage = await responseText(`/blogs/${ids.blog}`);
    assert.equal(blogPage.response.status, 200);
    assert.ok(blogPage.text.includes(blogBase.title) && blogPage.text.includes(blogBase.content), "blog detail should SSR current content");

    const blogUpdated = {
      ...blogBase,
      title: `${marker} Blog Updated`,
      content: `${marker} updated blog content confirmed from MongoDB and public SSR.`,
    };
    blog = await client.mutation("blog.update", { id: ids.blog, ...blogUpdated });
    assert.equal(blog.title, blogUpdated.title);
    assert.equal(blog.content, blogUpdated.content);
    assert.equal((await persisted("blogs", ids.blog, "updated blog")).content, blogUpdated.content);
    blog = await client.query("blog.getById", { id: ids.blog });
    assert.equal(blog.title, blogUpdated.title);
    assert.equal(blog.content, blogUpdated.content);
    blogPage = await responseText(`/blogs/${ids.blog}`);
    assert.equal(blogPage.response.status, 200);
    assert.ok(blogPage.text.includes(blogUpdated.title) && blogPage.text.includes(blogUpdated.content));

    await client.mutation("blog.update", { id: ids.blog, ...blogUpdated, published: false });
    publicBlogs = await client.query("blog.getAll");
    assert.ok(!publicBlogs.some((item) => item.id === ids.blog), "unpublished blog must be absent from public API");
    await expectNotFound(client.query("blog.getById", { id: ids.blog }), "unpublished blog detail API");
    blogPage = await responseText(`/blogs/${ids.blog}`);
    assert.equal(blogPage.response.status, 404, "unpublished blog detail must be not found");
    await client.mutation("blog.update", { id: ids.blog, ...blogUpdated, published: true });
    blogPage = await responseText(`/blogs/${ids.blog}`);
    assert.equal(blogPage.response.status, 200, "republished blog should render on a fresh request");
    assert.ok(blogPage.text.includes(blogUpdated.title));

    await client.mutation("blog.delete", { id: ids.blog });
    assert.ok(!(await client.query("blog.adminList")).some((item) => item.id === ids.blog));
    await expectNotFound(client.query("blog.getById", { id: ids.blog }), "deleted blog");
    blogPage = await responseText(`/blogs/${ids.blog}`);
    assert.equal(blogPage.response.status, 404);
    assert.equal(await mongoose.connection.collection("blogs").findOne({ _id: new mongoose.Types.ObjectId(ids.blog) }), null);
    console.log("BLOG CRUD, publish visibility, SSR, and invalid-input tests passed.");
  } finally {
    const cleanupErrors = [];
    for (const [key, collection] of [["lead", "messages"], ["project", "projects"], ["blog", "blogs"]]) {
      const id = ids[key];
      if (id && mongoose.isValidObjectId(id)) {
        try {
          await mongoose.connection.collection(collection).deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        } catch (error) {
          cleanupErrors.push(error);
        }
      }
    }
    for (const [collection, query] of [
      ["messages", { $or: [{ email: `${marker.toLowerCase()}@example.invalid` }, { company: marker }, { message: { $regex: marker } }, { utmSource: marker }] }],
      ["projects", { title: { $regex: marker } }],
      ["blogs", { title: { $regex: marker } }],
    ]) {
      try {
        await mongoose.connection.collection(collection).deleteMany(query);
        const remaining = await mongoose.connection.collection(collection).countDocuments(query);
        assert.equal(remaining, 0, `cleanup should remove all marked records from ${collection}`);
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
    try {
      await mongoose.disconnect();
    } catch (error) {
      cleanupErrors.push(error);
    }
    if (cleanupErrors.length > 0) {
      throw new AggregateError(cleanupErrors, "CRUD test cleanup did not complete successfully.");
    }
  }
}

await main();
console.log(`CRUD_TEST marker ${marker}: all tracked records were removed.`);
