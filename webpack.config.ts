import webpack from "webpack";
import "webpack-dev-server";
import path from "path";
import glob from "glob";
import fs from "fs";
import yaml from "yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __dirname = path.resolve();
const postChunkPrefix = "post-";

// 获取 src/posts 下的所有 .md 文件
const posts: { conf?: any; md?: string; html?: string } = glob
  .sync(path.resolve(__dirname, "src/posts/*.md"))
  .map((x) => path.basename(x, ".md"))
  .reduce((posts, key) => {
    let conf = {};
    const md = fs
      .readFileSync(path.resolve(__dirname, "src/posts", key) + ".md", "utf8")
      .toString();
    const processor = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ["yaml"])
      .use(() => (tree) => {
        if (tree.children[0]?.type === "yaml") {
          try {
            conf = yaml.parse(tree.children[0].value);
          } catch (err) {
            console.log("error on parsing yaml: " + key);
            throw err;
          }
          tree.children.shift();
        }
      })
      .use(remarkGfm)
      .use(remarkMath);
    // 生成去除头部 yaml 的 markdown
    const description = processor().use(remarkStringify).processSync(md).toString().slice(0, 256);
    // 根据 markdown 生成 html
    // 使用 KaTeX 渲染数学公式
    const html = processor()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(rehypeKatex, { trust: true, strict: "ignore" })
      .use(rehypeStringify, { closeSelfClosing: true })
      .processSync(md)
      .toString();
    posts[key] = { conf: conf, md: md, html: html, description: description };
    return posts;
  }, {});

function Entry() {
  let entry: webpack.EntryObject = {};
  entry.index = path.resolve(__dirname, "src/ts/index.ts");
  entry.about = path.resolve(__dirname, "src/ts/about.ts");
  entry = Object.keys(posts).reduce((obj, x) => {
    obj[postChunkPrefix + x] = {
      import: path.resolve(__dirname, "src/ts/post.ts"),
      runtime: "post",
    };
    return obj;
  }, entry);
  return entry;
}

function Plugins() {
  return [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      _: "underscore",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:7].css",
    }),
    new HtmlWebpackPlugin({
      title: "yzy1's blog",
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.ejs"),
      chunks: ["index"],
      templateParameters: { posts: posts },
    }),
    new HtmlWebpackPlugin({
      title: "About",
      filename: "about.html",
      template: path.resolve(__dirname, "src/about.ejs"),
      chunks: ["about"],
    }),
  ].concat(
    Object.entries(posts).map(
      ([postId, post]) =>
        new HtmlWebpackPlugin({
          title: post.conf.title,
          filename: `post/${postId}.html`,
          template: path.resolve(__dirname, "src/post.ejs"),
          chunks: [postChunkPrefix + postId],
          templateParameters: { post: posts[postId] },
        }),
    ),
  );
}

const config: webpack.Configuration = {
  mode: "development",
  performance: { hints: false },
  entry: Entry(),
  devtool: "eval-source-map",
  plugins: Plugins(),
  output: {
    filename: (pathData) => {
      return pathData.chunk?.name?.startsWith(postChunkPrefix)
        ? `js/post/${pathData.chunk.name.substring(postChunkPrefix.length)}.[contenthash:7].js`
        : "js/[name].[contenthash:7].js";
    },
    path: path.resolve(__dirname, "docs"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[contenthash:7].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[contenthash:7].[ext]",
            },
          },
        ],
      },
      {
        test: /\.ejs$/,
        loader: "ejs-loader",
        options: {
          esModule: false,
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    mainFiles: [],
    roots: [path.resolve(__dirname, "src")],
  },
  devServer: {
    devMiddleware: {
      index: "index.html",
    },
  },
  externals: {
    jquery: "jQuery",
  },
};

export default config;
