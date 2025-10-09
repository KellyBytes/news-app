import { useEffect, useState } from 'react';
import noImg from '../assets/images/no-img.png';
import axios from 'axios';
import NewsModal from './NewsModal';
import Bookmarks from './Bookmarks';
import Weather from './Weather';
import Calendar from './Calendar';

const News = () => {
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
    <div className="news-container w-[90vw] h-[90vh] lg:max-w-[95vmax] lg:max-h-[90vmin] xl:max-w-[90vmax] xl:max-h-[85vmin] flex flex-col justify-between gap-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:overflow-hidden bg-zinc-950 shadow-[0_1rem_2rem_rgba(0,0,0,0.5)] rounded-xl font-light text-neutral-200">
      <header className="news-header w-full h-16 flex justify-between items-center px-8 py-4 bg-zinc-900 rounded-tl-xl rounded-br-none rounded-tr-xl rounded-bl-none">
        <h1 className="logo font-bitter font-[600] uppercase text-[clamp(1.125rem,1.05rem+0.375vw,1.5rem)] sm:text-3xl tracking-wide text-nowrap lg:pl-3">
          News App
        </h1>
        <div className="search-bar relative">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search News..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-36 lg:w-80 h-10 pl-6 pr-10 py-0 bg-zinc-950 outline-none rounded-4xl focus:w-48 focus:lg:w-96 focus:placeholder-transparent transition-width duration-300"
            />
            <button
              type="submit"
              className="bg-transparent absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400 text-lg cursor-pointer"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      </header>

      <div className="news-content w-full flex-1 flex flex-col gap-y-4 lg:flex-row lg:gap-x-4 lg:h-[calc(100%-16rem)] px-6 py-0">
        <div className="navbar w-full lg:w-45 xl:w-56 2xl:w-64 flex flex-col sm:flex-row lg:flex-col justify-between gap-y-4 sm:gap-y-6">
          <nav className="categories w-full h-fit lg:h-full flex flex-col justify-center items-center lg:justify-normal gap-x-4 lg:gap-y-3 p-4 bg-zinc-900 rounded-xl">
            <h1 className="nav-heading hidden sm:block mb-4 font-[500] uppercase text-[clamp(0.875rem,0.8rem+0.6vw,1.25rem)] tracking-wide">
              Categories
            </h1>
            <div className="nav-links flex flex-wrap justify-center lg:flex-col gap-y-4 text-xs sm:text-sm xl:text-base uppercase tracking-wider">
              {categories.map((category) => (
                <a
                  href="#"
                  key={category}
                  className={`nav-link mr-8 lg:mr-0 ${
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
                Bookmarks{' '}
                <i className="bx bxs-bookmarks text-xl align-middle lg:align-bottom mt-0 lg:mt-2"></i>
              </a>
            </div>
          </nav>
        </div>

        <div className="news-section w-full lg:flex-1 h-full rounded-xl overflow-hidden">
          {headline && (
            <div
              className="headline w-full sm:h-[30%] md:h-[45%] bg-zinc-900 rounded-xl mb-4 relative"
              onClick={() => {
                handleArticleClick(headline);
              }}
            >
              <img
                src={headline.image || noImg}
                alt={headline.title}
                className="w-full h-full object-cover rounded-xl opacity-40"
              />
              <h2 className="headline-title w-full absolute bottom-0 left-0 pl-4 pr-16 py-4 font-bitter font-[500] text-[clamp(0.875rem,1.4cqi,2rem)] tracking-wide text-neutral-100 bg-[rgba(0,0,0,0.7)] rounded-br-xl rounded-bl-xl">
                {headline.title}
                <i
                  className={`bx ${
                    bookmarks.some(
                      (bookmark) => bookmark.title === headline.title
                    )
                      ? 'bxs-bookmarks'
                      : 'bx-bookmarks'
                  } text-base md:text-lg absolute bottom-4 right-4 cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(headline);
                  }}
                ></i>
              </h2>
            </div>
          )}
          <div className="news-grid w-full sm:h-[calc(70%-1rem)] md:h-[calc(55%-1rem)] bg-zinc-900 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] justify-center items-center">
            {news.map((article, index) => (
              <div
                key={index}
                className="news-grid-item w-full h-full min-h-60 rounded-xl relative"
                onClick={() => {
                  handleArticleClick(article);
                }}
              >
                <img
                  src={article.image || noImg}
                  alt={article.title}
                  className="w-full h-full block object-cover rounded-xl opacity-50"
                />
                <h3 className="absolute bottom-0 left-0 py-4 pr-12 pl-4 font-bitter font-light text-[clamp(0.75rem,1.2cqi,1rem)] tracking-wide bg-[rgba(0,0,0,0.7)] w-full rounded-tl-0 rounded-tr-0 rounded-br-xl rounded-bl-xl">
                  {article.title}
                  <i
                    className={`bx ${
                      bookmarks.some(
                        (bookmark) => bookmark.title === article.title
                      )
                        ? 'bxs-bookmarks'
                        : 'bx-bookmarks'
                    } text-base md:text-lg absolute bottom-4 right-4 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkClick(article);
                    }}
                  ></i>
                </h3>
              </div>
            ))}
          </div>
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

        <div className="weather-calendar flex flex-col sm:flex-row lg:flex-col gap-x-4 gap-y-4">
          <Weather />
          <Calendar />
        </div>
      </div>

      <footer className="news-footer w-full h-12 flex flex-col justify-center items-center gap-y-1 sm:flex-row sm:justify-between px-6 py-8 bg-zinc-900 rounded-tl-0 rounded-tr-0 rounded-br-xl rounded-bl-xl">
        <p className="font-bitter font-bold uppercase text-base tracking-wide text-neutral-300 sm:text-transparent">
          News App
        </p>
        <p className="font-light text-sm text-neutral-300">
          &copy; All Right Reserved By KellyBytes
        </p>
      </footer>
    </div>
  );
};

export default News;
