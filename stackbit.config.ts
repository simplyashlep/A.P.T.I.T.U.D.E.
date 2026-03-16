import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  nodeVersion: "18",
  ssgName: "jekyll",
  ssgDir: ".",
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: [".", "bias-beacon", "_posts"],
      models: [
        // Page model for standard markdown pages
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "{slug}.md",
          fields: [
            { name: "title", type: "string", required: true, label: "Title" },
            {
              name: "layout",
              type: "enum",
              options: ["page", "default"],
              default: "page",
              label: "Layout",
            },
            { name: "permalink", type: "string", label: "Permalink" },
            { name: "description", type: "text", label: "Description" },
          ],
        },
        // Bias Beacon page model
        {
          name: "BiasBeaconPage",
          type: "page",
          urlPath: "/bias-beacon/{slug}",
          filePath: "bias-beacon/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true, label: "Title" },
            {
              name: "layout",
              type: "enum",
              options: ["page", "default"],
              default: "page",
              label: "Layout",
            },
            { name: "permalink", type: "string", label: "Permalink" },
            { name: "description", type: "text", label: "Description" },
          ],
        },
        // Blog post model
        {
          name: "Post",
          type: "page",
          urlPath: "/{year}/{month}/{day}/{slug}",
          filePath: "_posts/{year}-{month}-{day}-{slug}.md",
          fields: [
            { name: "title", type: "string", required: true, label: "Title" },
            {
              name: "layout",
              type: "enum",
              options: ["post", "default"],
              default: "post",
              label: "Layout",
            },
            { name: "date", type: "datetime", required: true, label: "Date" },
            {
              name: "categories",
              type: "list",
              items: { type: "string" },
              label: "Categories",
            },
            { name: "author", type: "string", label: "Author" },
            { name: "excerpt", type: "text", label: "Excerpt" },
          ],
        },
        // Site configuration model (for _config.yml)
        {
          name: "SiteConfig",
          type: "data",
          filePath: "_config.yml",
          fields: [
            { name: "title", type: "string", required: true, label: "Site Title" },
            { name: "email", type: "string", label: "Contact Email" },
            { name: "description", type: "text", label: "Site Description" },
            { name: "baseurl", type: "string", label: "Base URL" },
            { name: "url", type: "string", label: "Site URL" },
          ],
        },
      ],
      assetsConfig: {
        referenceType: "static",
        staticDir: "assets",
        uploadDir: "images",
        publicPath: "/assets",
      },
    }),
  ],
  // Development command for local preview
  devCommand: "bundle exec jekyll serve --livereload --port {PORT}",
  // Build output directory
  buildCommand: "bundle exec jekyll build",
  publishDir: "_site",
});
