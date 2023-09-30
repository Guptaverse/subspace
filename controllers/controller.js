const lodash = require("lodash");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const memoizedFetchData = lodash.memoize(fetchData, undefined, 300000);


async function fetchData() {
  const curlCommand = `curl -s --request GET \
    --url https://intent-kit-16.hasura.app/api/rest/blogs \
    --header 'x-hasura-admin-secret: 32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'`;

  try {
    const { stdout, stderr } = await exec(curlCommand);

    if (stderr) {
      throw new Error(`Error: ${stderr}`);
    }

    return JSON.parse(stdout).blogs;
  } catch (error) {
    throw error;
  }
}

exports.blogStats = async (req, res) => {
  try {
    const blogs = await memoizedFetchData();

    // Data Analysis
    const totalBlogs = blogs.length;
    const longestBlog = lodash.maxBy(blogs, "title.length");
    const blogsWithPrivacy = blogs.filter((blog) =>
      blog.title.toLowerCase().includes("privacy")
    );
    const uniqueBlogTitles = lodash.uniqBy(blogs, "title");

    // Response-> JSON object containing statistics
    res.json({
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map((blog) => blog.title),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.blogSearch = async (req, res) => {
  let query = req.query.query;
  if (!query) {
    return res
      .status(400)
      .json({ error: 'Query parameter "query" is required.' });
  }

  query = query.toLowerCase();

  try {
    const blogs = await memoizedFetchData();
    const matchingBlogs = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query)
    );

    res.json(matchingBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
