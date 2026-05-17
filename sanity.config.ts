import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schema";

export default defineConfig({
    name: "aimiko-studio",
    title: "Aimiko Admin",
    projectId: "03olwsys",
    dataset: "production",
    basePath: "/studio",
    apiVersion: "2024-01-01",
    plugins: [structureTool()],
    schema: {
      types: schemaTypes,
    },
  });