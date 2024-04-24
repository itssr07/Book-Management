import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AddBook() {
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    publishedYear: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/book/book",
        bookDetails
      );
      if (response.status === 200) {
        await Swal.fire({
          title: "Success!",
          text: "Book added Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/");
      } else {
        await Swal.fire({
          title: "Error!",
          text: "Please try to add again!",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
      setBookDetails({
        title: "",
        author: "",
        publishedYear: "",
      });
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error!",
        text: "Please try again!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <div className="p-8 ">
        <h1 className="font-medium text-3xl">Add Book</h1>
        <p className="text-gray-600 mt-6">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos
          dolorem vel cupiditate laudantium dicta.
        </p>
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="mt-8 grid lg:grid-cols-2 gap-4">
            {" "}
            <div>
              <label
                htmlFor="title"
                className="text-base text-gray-700 block mb-1 font-medium"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={bookDetails.title}
                onChange={handleChange}
                className="bg-gray-50 border mt-2 border-gray-200 rounded py-2 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="eg: #45G678"
              />
            </div>{" "}
            <div>
              {" "}
              <label
                htmlFor="author"
                className="text-base text-gray-700 block mb-1 font-medium"
              >
                Author
              </label>
              <input
                type="text"
                name="author"
                id="author"
                value={bookDetails.author}
                onChange={handleChange}
                className="bg-gray-50 border mt-2 border-gray-200 rounded py-2  px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="eg : red, blue, green etc."
              />
            </div>{" "}
            <div>
              {" "}
              <label
                htmlFor="publishedYear"
                className="text-base text-gray-700 block mb-1 font-medium"
              >
                Published Year
              </label>
              <input
                type="number"
                name="publishedYear"
                id="publishedYear"
                value={bookDetails.publishedYear}
                onChange={handleChange}
                className="bg-gray-50 border mt-2 border-gray-200 rounded py-2  px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="eg : Rs.300"
              />
            </div>{" "}
          </div>{" "}
          <div className="space-x-4 mt-8 flex justify-end">
            <button
              type="submit"
              className="py-2 px-6 font-semibold bg-amber-300 text-black rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
            >
              Create
            </button>
            <button className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50">
              Cancel
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>
    </div>
  );
}

export default AddBook;
