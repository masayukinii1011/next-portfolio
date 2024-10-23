import * as contentful from "contentful";

const client = contentful.createClient({
  space: process.env.CTF_SPACE_ID || "",
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN || "",
});

export type Category = {
  slug: string;
  title: string;
};

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await client.getEntries({
      content_type: "category",
      order: ["fields.id"],
    });
    const categories = res.items.map((item) => {
      return {
        title: item.fields.title as string,
        slug: item.fields.slug as string,
      };
    });
    categories.push(
      {
        title: "Music",
        slug: "music",
      },
      {
        title: "Contact",
        slug: "contact",
      }
    );
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<Post> {
  try {
    const res = await client.getEntries({
      content_type: process.env.CTF_BLOG_POST_TYPE_ID || "",
      "fields.slug": slug,
    });
    return convertPost(res.items[0]);
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  try {
    const res = await client.getEntries({
      content_type: process.env.CTF_BLOG_POST_TYPE_ID || "",
      order: ["-fields.publishDate"],
      "fields.category.fields.slug": category,
      "fields.category.sys.contentType.sys.id": "category",
    });
    return res.items.map((item) => convertPost(item));
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
}

export type Post = {
  slug: string;
  title: string;
  body: string;
  publishDate: string;
  githubLink: string;
  demoLink: string;
  image: Image;
  category: Category;
};

export type Image = {
  title: string;
  url: string;
};

function convertPost(
  entry: contentful.Entry<contentful.EntrySkeletonType, undefined, string>
): Post {
  return {
    slug: ensureString(entry.fields.slug),
    title: ensureString(entry.fields.title),
    body: ensureString(entry.fields.body),
    publishDate: ensureString(entry.fields.publishDate),
    githubLink: ensureString(entry.fields.githubLink),
    demoLink: ensureString(entry.fields.demoLink),
    image: ensureImage(entry.fields.image),
    category: ensureCategory(entry.fields.category),
  };
}

function ensureString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function ensureCategory(value: unknown): Category {
  const category = {
    slug: "",
    title: "",
  };

  if (
    value &&
    typeof value === "object" &&
    "fields" in value &&
    value.fields &&
    typeof value.fields === "object"
  ) {
    if ("slug" in value.fields && typeof value.fields.slug === "string") {
      category.slug = value.fields.slug;
    }
    if ("title" in value.fields && typeof value.fields.title === "string") {
      category.title = value.fields.title;
    }
  }

  return category;
}

function ensureImage(value: unknown): Image {
  const image = {
    title: "",
    url: "",
  };

  if (
    value &&
    typeof value === "object" &&
    "fields" in value &&
    value.fields &&
    typeof value.fields === "object"
  ) {
    if ("title" in value.fields && typeof value.fields.title === "string") {
      image.title = value.fields.title;
    }
    if (
      "file" in value.fields &&
      typeof value.fields.file === "object" &&
      value.fields.file &&
      "url" in value.fields.file &&
      typeof value.fields.file.url === "string"
    ) {
      image.url = `https:${value.fields.file.url}`;
    }
  }

  return image;
}
