import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Book() {
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [editBox, setEditBox] = useState(false);
  const [editedComponent, setEditedComponent] = useState({
    title: "",
    author: "",
    publishedYear: "",
  });
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    axios
      .get("https://book-management-backend-wlqa.onrender.com/api/book/book")
      .then((res) => {
        const reversedBooks = res.data.reverse();
        setBooks(reversedBooks);
        setTotalBooks(reversedBooks.length);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (bookId) => {
    axios
      .delete(`http://localhost:5000/api/book/book/${bookId}`)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Success!",
            text: "Book Deleted Successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchData();
        } else {
          Swal.fire({
            title: "Error!",
            text: "Please try again!",
            icon: "error",
            confirmButtonText: "Cool",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting book");
      });
  };

  const handleInputChange = (e, fieldName) => {
    e.preventDefault();

    setEditedComponent((prevState) => ({
      ...prevState,
      [fieldName]: e.target.value,
    }));
  };

  const handleEdit = (component) => {
    setEditedComponent(component);
    setEditBox(true);
  };

  const handleUpdate = () => {
    axios
      .put(
        `http://localhost:5000/api/book/book/${editedComponent._id}`, // Change to use _id instead of componentCode
        editedComponent
      )
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Success!",
            text: "Book Updated Successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
          setEditBox(false);
          fetchData();
        } else {
          Swal.fire({
            title: "Error!",
            text: "Please try again!",
            icon: "error",
            confirmButtonText: "Cool",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error updating Book");
      });
  };

  const exportToCSV = () => {
    const csvData = convertToCSV(books);
    const csvFileName = "booklist.csv";
    downloadCSV(csvData, csvFileName);
  };

  const convertToCSV = (data) => {
    const header = ["title", "author", "publishedYear"];
    const rows = data.map((book) => [
      book.title,
      book.author,
      book.publishedYear,
    ]);

    const csvArray = [header, ...rows];
    return csvArray.map((row) => row.join(",")).join("\n");
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div>
      <div
        className={`${editBox ? "" : "hidden"} relative z-[100]`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full  justify-center p-4 text-center items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all  sm:w-full sm:max-w-3xl">
              <div className="">
                <p className="text-xl py-6 bg-amber-400 text-white font-semibold text-center">
                  Update Book
                </p>
              </div>
              <div className="px-16 py-6">
                <p className="">* Edit all the mention details carefully</p>
              </div>

              <div className="px-16 py-2 mb-6 grid grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Book Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editedComponent.title}
                    onChange={(e) => handleInputChange(e, "title")}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>{" "}
                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={editedComponent.author}
                    onChange={(e) => handleInputChange(e, "author")}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="publishedYear"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Published Year
                  </label>
                  <input
                    type="number"
                    id="publishedYear"
                    name="publishedYear"
                    value={editedComponent.publishedYear}
                    onChange={(e) => handleInputChange(e, "publishedYear")}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center w-full bg-gray-50 px-4 gap-x-6 py-6 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={handleUpdate}
                  className="focus:outline-none transition duration-150 ease-in-out hover:bg-orange-400 bg-orange-500 rounded text-white px-4 sm:px-8 py-2 text-xs sm:text-sm"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditBox(false)}
                  className="focus:outline-none ml-3 bg-gray-100 dark:bg-gray-700 dark:border-gray-700 dark:hover:bg-gray-600 transition duration-150 text-gray-600 dark:text-gray-400 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="mx-auto px-8 lg:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-gray-800 ">Book List</h2>

              <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                {totalBooks} Books
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Total number of books in the list.
            </p>
          </div>

          <div className="flex items-center mt-4 gap-x-3">
            <button
              type="submit"
              onClick={exportToCSV}
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3098_154395)">
                  <path
                    d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
                    stroke="currentColor"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3098_154395">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>Export CSV</span>
            </button>

            <Link
              to="/add-book"
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>Add Book</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 md:flex md:items-center md:justify-between">
          <div className="relative flex items-center mt-4 md:mt-0">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-base font-semibold text-left rtl:text-right text-gray-800 dark:text-gray-400"
                      >
                        Title
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-base font-semibold text-left rtl:text-right text-gray-800 dark:text-gray-400"
                      >
                        Author
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-base font-semibold text-left rtl:text-right text-gray-800 dark:text-gray-400"
                      >
                        Published Year
                      </th>

                      <th scope="col" className="relative py-3.5 px-4">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {filteredBooks?.map((book, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                          <div>
                            <h2 className="font-medium text-gray-800  ">
                              {book.title}
                            </h2>
                          </div>
                        </td>
                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="inline  py-1 text-sm font-normal rounded-full text-gray-700 gap-x-2  dark:bg-gray-800">
                            {" "}
                            {book.author}
                          </div>
                        </td>
                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="inline  py-1 text-sm font-normal rounded-full text-gray-700 gap-x-2  dark:bg-gray-800">
                            {book.publishedYear}
                          </div>
                        </td>

                        <div className="flex flex-row justify-center gap-x-2 ">
                          <td className=" py-4 text-sm whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleEdit(book)}
                              className="text-sm px-4 bg-blue-400 hover:bg-red-700 text-white py-1  rounded focus:outline-none focus:shadow-outline"
                            >
                              Edit
                            </button>
                          </td>

                          <td className=" py-4 text-sm whitespace-nowrap">
                            <button
                              type="button"
                              className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                              onClick={() => handleDelete(book._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </div>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Book;
