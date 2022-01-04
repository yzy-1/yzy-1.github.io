import Webpack from "webpack";
import "webpack-dev-server";
import path from "path";
import glob from "glob";
import fs from "fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __dirname = path.resolve();

// 获取 src/posts 下的所有 .md 文件
const posts = glob
  .sync(path.resolve(__dirname, "src/posts/*.md"))
  .map((x) => path.basename(x, ".md"))
  .reduce((posts, key) => {
    const data = fs
      .readFileSync(path.resolve(__dirname, "src/posts", key) + ".md", "utf8")
      .toString();
    // 按照 --- 将 .md 分割成 json 和 markdown 两部分
    const separator = "---\n";
    const [conf, ...splittedMd] = data.split("---\n");
    const md = splittedMd.join(separator);
    // 根据 markdown 生成 html
    // 使用 KaTeX 渲染数学公式
    const html = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeKatex, { trust: true, strict: "ignore" })
      .use(rehypeStringify, { closeSelfClosing: true })
      .processSync(md);
    posts[key] = { conf: JSON.parse(conf), md: md, html: html };
    return posts;
  }, {});

function Entry() {
  let entry: any = {};
  entry.index = path.resolve(__dirname, "src/ts/index.ts");
  entry.about = path.resolve(__dirname, "src/ts/about.ts");
  entry = Object.keys(posts).reduce((obj, x) => {
    obj[x] = { import: path.resolve(__dirname, "src/ts/post.ts"), runtime: "post" };
    return obj;
  }, entry);
  return entry;
}

function Plugins() {
  return [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:7].css",
    }),
    new HtmlWebpackPlugin({
      title: "Index",
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.tpl.html"),
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      title: "About",
      filename: "about.html",
      template: path.resolve(__dirname, "src/about.tpl.html"),
      chunks: ["about"],
    }),
  ].concat(
    Object.keys(posts).map(
      (x) =>
        new HtmlWebpackPlugin({
          title: x,
          filename: "posts/" + x + ".html",
          template: path.resolve(__dirname, "src/post.tpl.html"),
          chunks: [x],
          templateParameters: { post: posts[x] },
        }),
    ),
  );
}

const config: Webpack.Configuration = {
  mode: "development",
  performance: { hints: false },
  entry: Entry(),
  devtool: "eval-source-map",
  plugins: Plugins(),
  output: {
    filename: "js/[name].[contenthash:7].js",
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
};

export default config;
