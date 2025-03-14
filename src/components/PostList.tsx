import { FC, useState, useEffect } from "react";
import Post from "./Post";
import Pagination from "./Pagination";
import axios from "axios";

interface PostType {
  _id: string;
  title: string;
  content: string;
  sender: string;
  pictureUrl?: string;
  likes?: string[];
}

interface PostListProps {
  filterByUser?: boolean;
  userName?: string;
}

const PostList: FC<PostListProps> = ({
  filterByUser = false,
  userName = "",
}) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 5; // Adjust as needed

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = "http://localhost:3000/api/posts";
        if (filterByUser && userName) {
          url = `http://localhost:3000/api/posts/sender/${userName}`;
        }
        const response = await axios.get(url);
        console.log(response);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Calculate posts for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Handle page change
  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Post List</h1>
      {/* Flex container to line posts horizontally */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {currentPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default PostList;
