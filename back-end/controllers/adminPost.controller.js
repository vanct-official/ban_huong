import Post from "../models/post.model.js";
import slugify from "slugify";
// ✅ Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });

    const host = `${req.protocol}://${req.get("host")}`;
    const formatted = posts.map((p) => ({
      ...p.toJSON(),
      image: p.thumbnail ? `${host}${p.thumbnail}` : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi getAllPosts:", err);
    res.status(500).json({ error: "Không thể lấy danh sách bài viết" });
  }
};

// ✅ Get single post
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    const host = `${req.protocol}://${req.get("host")}`;
    res.json({
      ...post.toJSON(),
      image: post.thumbnail ? `${host}${post.thumbnail}` : null,
    });
  } catch (err) {
    console.error("❌ Lỗi getPostById:", err);
    res.status(500).json({ error: "Không thể lấy bài viết" });
  }
};

// ✅ Update Post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, slug } = req.body;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    let thumbnail = post.thumbnail;
    if (req.file) {
      thumbnail = `/uploads/posts/${req.file.filename}`;
    }

    await post.update({ title, slug, content, author, thumbnail });

    const host = `${req.protocol}://${req.get("host")}`;
    res.json({
      message: "Cập nhật bài viết thành công",
      post: {
        ...post.toJSON(),
        image: post.thumbnail ? `${host}${post.thumbnail}` : null,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi updatePost:", err);
    res.status(500).json({ error: "Không thể cập nhật bài viết" });
  }
};

// ✅ Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    await post.destroy();
    res.json({ message: "Xóa bài viết thành công" });
  } catch (err) {
    console.error("❌ Lỗi deletePost:", err);
    res.status(500).json({ error: "Không thể xóa bài viết" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // 👉 tạo slug từ title
    const slug = slugify(title, { lower: true, strict: true });

    let thumbnail = null;
    if (req.file) {
      thumbnail = `/uploads/posts/${req.file.filename}`;
    }

    const post = await Post.create({ title, slug, content, author, thumbnail });

    const host = `${req.protocol}://${req.get("host")}`;
    res.json({
      message: "✅ Thêm bài viết thành công",
      post: {
        ...post.toJSON(),
        image: post.thumbnail ? `${host}${post.thumbnail}` : null,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi createPost:", err);
    res.status(500).json({ error: "Không thể thêm bài viết" });
  }
};
