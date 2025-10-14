import { useEffect, useState } from 'react';
import noImg from '../assets/images/no-img.png';
import axios from 'axios';
import NewsModal from './NewsModal';
import Bookmarks from './Bookmarks';
import Weather from './Weather';

const News = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headline, setHeadline] = useState(null);
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);

  const categories = [
    'general',
    'world',
    'business',
    'technology',
    'entertainment',
    'sports',
    'science',
    'health',
    'nation',
  ];

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setSearchInput('');
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
    setShowBookmarksModal(false);
  };

  const handleBookmarkClick = (article) => {
    setBookmarks((prevBookmarks) => {
      const updatedBookmarks = prevBookmarks.find(
        (bookmark) => bookmark.title === article.title
      )
        ? // delete if the bookmarked news is clicked
          prevBookmarks.filter((bookmark) => bookmark.title !== article.title)
        : [...prevBookmarks, article];

      const sortedBookmarks = [...updatedBookmarks].sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );

      localStorage.setItem('bookmarks', JSON.stringify(sortedBookmarks));
      return sortedBookmarks;
    });
  };

  useEffect(() => {
    const fetchNews = async () => {
      // --- Comment out the following to deploy
      // const N_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
      // let url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&country=ca&apikey=${N_API_KEY}`;

      // if (searchQuery) {
      //   url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&country=ca&apikey=${N_API_KEY}`;
      // }

      // const response = await axios.get(url);
      /// --- Comment out above to deploy

      // --- Uncomment the following to deploy
      const response = await axios.get(
        `/.netlify/functions/getNews?category=${selectedCategory}&search=${searchQuery}`
      );
      // --- Uncomment above to deploy

      const fetchedNews = response.data.articles;

      setHeadline(fetchedNews[0]);
      setNews(fetchedNews.slice(1, 7));
    };

    fetchNews();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(savedBookmarks);
  }, []);

  return (
    <div className="news-container w-full min-h-full flex flex-col justify-between items-center">
      <header className="news-header w-full h-fit flex justify-center bg-neutral-800 text-neutral-100">
        <div className="w-[clamp(18.75rem,9rem+48.75vw,67.5rem)] flex flex-col items-center gap-y-4 lg:flex-row lg:justify-between lg:items-center px-8 pt-4 pb-0 lg:py-4">
          <h1 className="logo font-bitter font-[600] text-[clamp(1.5rem,0.95rem+0.875vw,2rem)] tracking-wide">
            Google News
          </h1>
          <div className="search-bar relative">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search News..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-[80cqi] sm:w-[60cqi] lg:w-80 h-10 pl-6 pr-10 py-0 bg-neutral-950 outline-none rounded-4xl focus:lg:w-96 focus:placeholder-transparent transition-width duration-300"
              />
              <button
                type="submit"
                className="bg-transparent absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400 text-base lg:text-lg cursor-pointer"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </div>
      </header>

      <nav className="navbar sticky top-0 z-10 w-full h-fit flex justify-center bg-neutral-800 text-neutral-100">
        <div className="nav-links w-[clamp(18.75rem,9rem+48.75vw,67.5rem)] flex justify-center gap-4 py-2 md:py-4 text-[clamp(0.75rem,0.7rem+0.25vw,1rem)] uppercase tracking-wide">
          {/* for larger screens */}
          <div className="hidden lg:flex flex-nowrap justify-center gap-x-4 gap-y-2">
            {categories.map((category) => (
              <a
                href="#"
                key={category}
                className={`nav-link ${
                  category === selectedCategory ? 'text-red-400' : ''
                }`}
                onClick={(e) => handleCategoryClick(e, category)}
              >
                {category}
              </a>
            ))}
            <a
              href="#"
              className="nav-link"
              onClick={() => setShowBookmarksModal(true)}
            >
              <i className="bx bxs-bookmarks text-xl align-middle"></i>
            </a>
          </div>

          {/* for smaller screens */}
          <div className="w-full flex justify-between items-center lg:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <i className="bx bx-menu text-3xl"></i>
            </button>
            <a
              href="#"
              className="nav-link"
              onClick={() => {
                setShowBookmarksModal(true);
                setMenuOpen(false);
              }}
            >
              Bookmarks{' '}
              <i className="bx bxs-bookmarks text-xl align-middle"></i>
            </a>
          </div>

          <div
            className={`absolute top-4 left-4 sm:left-10 md:left-18 w-fit bg-neutral-900 flex flex-col gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ease-in-out ${
              menuOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            {categories.map((category) => (
              <a
                href="#"
                key={category}
                className={`nav-link ${
                  category === selectedCategory ? 'text-red-400' : ''
                }`}
                onClick={(e) => {
                  handleCategoryClick(e, category);
                  setMenuOpen(false);
                }}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="news-content w-[clamp(18.75rem,80vw,66rem)] flex-1 overflow-y-auto flex flex-col gap-y-4 pt-6 pb-16">
        <div className="w-full lg:h-[35vh] lg:max-h-[24rem] flex flex-col lg:flex-row-reverse justify-between gap-x-4 gap-y-4">
          <div className="weather w-full lg:w-1/3">
            <Weather />
          </div>

          {headline && (
            <div
              className="headline w-full lg:w-2/3 h-[30vh] min-h-64 lg:h-full rounded-xl overflow-hidden hover:bg-neutral-900 hover:ring hover:ring-neutral-800/20 hover:shadow-md hover:shadow-neutral-900/20 active:translate-y-1 transition duration-300 relative"
              onClick={() => {
                handleArticleClick(headline);
              }}
            >
              <img
                src={headline.image || noImg}
                alt={headline.title}
                className="w-full h-full object-cover rounded-xl opacity-90"
              />
              <h2 className="headline-title absolute bottom-0 left-0 w-full pl-8 pr-16 py-8 font-bitter font-[500] uppercase text-[clamp(0.875rem,0.8rem+0.375vw,1.25rem)] tracking-wider text-neutral-100 bg-[rgba(0,0,0,0.7)] rounded-br-xl rounded-bl-xl">
                {headline.title}
                <i
                  className={`bx ${
                    bookmarks.some(
                      (bookmark) => bookmark.title === headline.title
                    )
                      ? 'bxs-bookmarks'
                      : 'bx-bookmarks'
                  } text-base md:text-xl xl:text-2xl absolute bottom-4 right-4 cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(headline);
                  }}
                ></i>
              </h2>
            </div>
          )}
        </div>

        <div className="news-grid w-full rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-start auto-rows-[18rem] sm:auto-rows-[12rem]">
          {news.map((article, index) => (
            <div
              key={index}
              className="news-grid-item w-full h-full rounded-xl shadow-lg relative"
              onClick={() => {
                handleArticleClick(article);
              }}
            >
              <img
                src={article.image || noImg}
                alt={article.title}
                className="w-full h-full block object-cover rounded-xl opacity-90"
              />
              <h3
                className="absolute bottom-0 left-0 w-full pl-4 pr-12 py-4 font-bitter text-[clamp(0.875rem,0.825rem+0.25vw,1.125rem)] tracking-wider text-neutral-100 bg-[rgba(0,0,0,0.7)] rounded-tl-0 rounded-tr-0 rounded-br-xl rounded-bl-xl
              "
              >
                {article.title}
                <i
                  className={`bx ${
                    bookmarks.some(
                      (bookmark) => bookmark.title === article.title
                    )
                      ? 'bxs-bookmarks'
                      : 'bx-bookmarks'
                  } text-base md:text-lg xl:text-xl absolute bottom-4 right-4 cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(article);
                  }}
                ></i>
              </h3>
            </div>
          ))}
        </div>
        <NewsModal
          show={showModal}
          article={selectedArticle}
          onClose={() => setShowModal(false)}
          bookmarks={bookmarks}
          onClickBookmark={handleBookmarkClick}
        />
        <Bookmarks
          show={showBookmarksModal}
          bookmarks={bookmarks}
          onClose={() => setShowBookmarksModal(false)}
          onSelectArticle={handleArticleClick}
          onDeleteBookmark={handleBookmarkClick}
        />
      </div>

      <footer className="news-footer fixed bottom-0 left-0 w-full h-fit px-8 py-4 bg-neutral-800">
        <p className="font-light text-sm text-center lg:text-right text-neutral-300">
          &copy; All Right Reserved By KellyBytes
        </p>
      </footer>
    </div>
  );
};

export default News;
