import Post from "../models/post.model.js";
import { Op } from "sequelize";
// ✅ Lấy tất cả bài viết
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
    });

    const host = `${req.protocol}://${req.get("host")}`;

    const formatted = posts.map((p) => {
      const data = p.toJSON();
      return {
        ...data,
        thumbnail: data.thumbnail
          ? `${host}${
              data.thumbnail.startsWith("/")
                ? data.thumbnail
                : "/" + data.thumbnail
            }`
          : null,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi getAllPosts:", err);
    res.status(500).json({ error: "Không thể lấy bài viết" });
  }
};

// ✅ Tạo bài viết mới
export const createPost = async (req, res) => {
  try {
    const { title, slug, content, author } = req.body;

    const thumbnail = req.file ? `/uploads/posts/${req.file.filename}` : null;

    const newPost = await Post.create({
      title,
      slug,
      content,
      thumbnail,
      author,
    });

    const host = `${req.protocol}://${req.get("host")}`;
    const data = newPost.toJSON();

    res.status(201).json({
      ...data,
      thumbnail: data.thumbnail
        ? `${host}${
            data.thumbnail.startsWith("/")
              ? data.thumbnail
              : "/" + data.thumbnail
          }`
        : null,
    });
  } catch (err) {
    console.error("❌ Lỗi createPost:", err);
    res.status(500).json({ error: "Không thể tạo bài viết" });
  }
};

// ✅ Xóa bài viết
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Post.destroy({ where: { id } });

    if (!deleted)
      return res.status(404).json({ error: "Bài viết không tồn tại" });

    res.json({ message: "Xóa bài viết thành công" });
  } catch (err) {
    console.error("❌ Lỗi deletePost:", err);
    res.status(500).json({ error: "Không thể xóa bài viết" });
  }
};

// ✅ Lấy bài viết mới nhất
export const getLatestPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "slug",
        "content",
        "thumbnail",
        "author",
        "createdAt",
        "updatedAt",
      ], // 👈 lấy đủ cột
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    const host = `${req.protocol}://${req.get("host")}`;
    const formatted = posts.map((p) => {
      const data = p.toJSON();
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        author: data.author,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        thumbnail: data.thumbnail
          ? `${host}${data.thumbnail}`
          : "/default-post.png",
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi getLatestPosts:", err);
    res.status(500).json({ error: "Không thể lấy bài viết mới nhất" });
  }
};

// Lấy bài viết liên quan (cùng tác giả, khác id)
export const getRelatedPosts = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ where: { slug } });

    if (!post) return res.status(404).json({ error: "Post not found" });

    const related = await Post.findAll({
      where: {
        id: { [Op.ne]: post.id }, // khác id hiện tại
      },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    res.json(related);
  } catch (err) {
    console.error("❌ Lỗi getRelatedPosts:", err);
    res.status(500).json({ error: "Không thể lấy bài viết liên quan" });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ where: { slug } });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const host = `${req.protocol}://${req.get("host")}`;
    const formatted = {
      ...post.toJSON(),
      image: post.thumbnail ? `${host}${post.thumbnail}` : null,
    };

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi getPostBySlug:", err);
    res.status(500).json({ error: "Không thể lấy bài viết" });
  }
};
