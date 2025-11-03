const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Satori is ESM-only, we'll use dynamic import
let satori;
const initSatori = async () => {
  if (!satori) {
    satori = (await import("satori")).default;
  }
  return satori;
};

/**
 * Docusaurus plugin to automatically generate Open Graph images for each page
 */
module.exports = function (context, options) {
  const ogDir = path.join(context.siteDir, "static", "img", "og");

  // Create og directory if it doesn't exist
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }

  return {
    name: "docusaurus-plugin-og-image-generator",

    async postBuild({ siteConfig, routesPaths, outDir, head }) {
      console.log("\n🎨 Generating Open Graph images...\n");

      // Read all docs from the docs directory
      const docsDir = path.join(context.siteDir, "docs");
      await generateImagesFromDirectory(docsDir, ogDir, siteConfig);

      console.log("✅ Open Graph images generated successfully!\n");
    },
  };
};

/**
 * Recursively scan docs directory and generate images
 */
async function generateImagesFromDirectory(dir, ogDir, siteConfig) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      await generateImagesFromDirectory(fullPath, ogDir, siteConfig);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
    ) {
      // Process markdown files
      const content = fs.readFileSync(fullPath, "utf-8");
      const metadata = extractFrontMatter(content);

      if (metadata.title) {
        const relativePath = path.relative(path.join(dir, ".."), fullPath);
        const slug = relativePath
          .replace(/\\/g, "/")
          .replace(/\.mdx?$/, "")
          .replace(/^docs\//, "");

        await generateOGImage({
          title: metadata.title,
          description: metadata.description || "",
          slug,
          ogDir,
          siteConfig,
        });
      }
    }
  }
}

/**
 * Extract front matter from markdown content
 */
function extractFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return {};
  }

  const frontMatter = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "");
      frontMatter[key.trim()] = value;
    }
  }

  return frontMatter;
}

/**
 * Generate an OG image for a specific page
 */
async function generateOGImage({
  title,
  description,
  slug,
  ogDir,
  siteConfig,
}) {
  try {
    const satoriRenderer = await initSatori();
    const width = 1200;
    const height = 630;

    // Truncate title if too long
    const maxTitleLength = 60;
    const displayTitle =
      title.length > maxTitleLength
        ? title.substring(0, maxTitleLength) + "..."
        : title;

    // Truncate description
    const maxDescLength = 120;
    const displayDesc =
      description && description.length > maxDescLength
        ? description.substring(0, maxDescLength) + "..."
        : description || "";

    // Create SVG using React-like JSX syntax
    // Resolve system fonts cross-platform (macOS, Linux, Windows)
    const candidates = [
      {
        name: "Sans",
        weight: 400,
        paths: [
          "/Library/Fonts/Arial.ttf",
          "/System/Library/Fonts/Supplemental/Arial.ttf",
          "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
          "C:/Windows/Fonts/arial.ttf",
        ],
      },
      {
        name: "Sans",
        weight: 700,
        paths: [
          "/Library/Fonts/Arial Bold.ttf",
          "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
          "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
          "C:/Windows/Fonts/arialbd.ttf",
        ],
      },
    ];

    const resolvedFonts = candidates
      .map((c) => {
        const found = c.paths.find((p) => {
          try {
            return fs.existsSync(p);
          } catch {
            return false;
          }
        });
        if (!found) return null;
        return {
          name: c.name,
          data: fs.readFileSync(found),
          weight: c.weight,
          style: "normal",
        };
      })
      .filter(Boolean);

    if (!resolvedFonts.length) {
      throw new Error(
        "No suitable system fonts found for Satori (tried Arial/DejaVu/Windows Arial)."
      );
    }

    const svg = await satoriRenderer(
      {
        type: "div",
        props: {
          style: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#1a1a2e",
            backgroundImage:
              "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            padding: 60,
            fontFamily: "Sans",
            position: "relative",
          },
          children: [
            // Decorative circles
            {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  top: -150,
                  right: -150,
                  width: 400,
                  height: 400,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                },
              },
            },
            {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  bottom: -100,
                  left: -100,
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                },
              },
            },
            // Content
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 40,
                },
                children: [
                  // Brand
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "#5ee0e4",
                      },
                      children: "Panaversity • AI Native Development",
                    },
                  },
                  // Title
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 56,
                        fontWeight: "bold",
                        color: "#ffffff",
                        lineHeight: 1.2,
                        maxWidth: 1000,
                      },
                      children: displayTitle,
                    },
                  },
                  // Description
                  displayDesc && {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 28,
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 1.4,
                        maxWidth: 1000,
                      },
                      children: displayDesc,
                    },
                  },
                ].filter(Boolean),
              },
            },
            // Footer
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingTop: 30,
                  borderTop: "4px solid #5ee0e4",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 28,
                        fontWeight: "bold",
                        color: "#5ee0e4",
                      },
                      children: "ai-native.panaversity.org",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width,
        height,
        fonts: resolvedFonts,
      }
    );

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    // Save the image
    const filename = slug.replace(/\//g, "-") + ".png";
    const filepath = path.join(ogDir, filename);
    fs.writeFileSync(filepath, pngBuffer);

    console.log(`  ✓ Generated: ${filename}`);
    return filepath;
  } catch (error) {
    console.error(
      `  ✗ Failed to generate image for "${title}":`,
      error.message
    );
    return null;
  }
}
