import noImg from '../assets/images/no-img.png';

const NewsModal = ({ show, article, onClose, bookmarks, onClickBookmark }) => {
  if (!show) return;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-[1000]"
      onClick={handleOverlayClick}
    >
      <div className="modal-content w-[90%] max-w-[40rem] h-auto max-h-[90%] bg-neutral-900 p-8 xl:p-10 rounded-xl shadow-[0,0,5rem,rgba(0,0,0,0.5)] relative overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
        <span
          className="close-button absolute top-3 right-5 text-lg text-neutral-100 cursor-pointer"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </span>
        {article && (
          <>
            <img
              src={article.image || noImg}
              alt={article.title}
              className="modal-image w-full h-auto max-h-64 xl:max-h-72 object-cover rounded-xl opacity-50"
            />
            <h2 className="modal-title font-bitter text-xl xl:text-3xl text-neutral-100 tracking-wide mt-6 xl:mt-8">
              {article.title}
            </h2>
            <p className="modal-source font-comfortaa text-sm xl:text-base text-neutral-300 mt-4">
              Source: {article.source.name}
            </p>
            <p className="modal-date font-comfortaa text-sm xl:text-base text-neutral-300 mt-2">
              {new Date(article.publishedAt).toLocaleString('en-CA', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="modal-content-text text-base xl:text-lg mt-6 xl:mt-8 leading-6 xl:leading-8 text-neutral-200">
              {article.content}
            </p>
            <div className="flex justify-between items-center w-full">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="read-more-link w-48 sm:w-56 inline-block bg-gradient-to-r from-purple-400 to-indigo-500 mt-8 py-4 px-8 text-neutral-50 rounded-[4rem] text-base xl:text-lg text-center uppercase tracking-widest active:translate-y-0.5"
              >
                Read More
              </a>
              <i
                className={`bx ${
                  bookmarks.some((bookmark) => bookmark.title === article.title)
                    ? 'bxs-bookmarks'
                    : 'bx-bookmarks'
                } text-neutral-100 text-xl xl:text-3xl translate-y-4 cursor-pointer`}
                onClick={() => onClickBookmark(article)}
              ></i>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsModal;
