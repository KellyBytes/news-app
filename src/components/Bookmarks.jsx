import noImg from '../assets/images/no-img.png';

const Bookmarks = ({
  show,
  bookmarks,
  onClose,
  onSelectArticle,
  onDeleteBookmark,
}) => {
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
      <div className="modal-content w-[90%] max-w-[40rem] h-auto max-h-[90%] bg-zinc-900 p-10 rounded-xl shadow-[0,0,5rem,rgba(0,0,0,0.5)] relative overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <span
          className="close-button absolute top-3 right-5 text-lg text-neutral-50 cursor-pointer"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </span>
        <h2 className="bookmarks-heading font-bitter text-xl sm:text-2xl font-light text-neutral-200 tracking-wide mb-8">
          Bookmarked News
        </h2>
        <div className="bookmarks-list flex flex-col gap-4">
          {bookmarks.map((article, index) => (
            <div
              className="bookmark-item flex items-center justify-between gap-x-4 cursor-pointer"
              key={index}
              onClick={() => onSelectArticle(article)}
            >
              <img
                src={article.image || noImg}
                alt={article.title}
                className="w-12 h-12 sm:w-20 sm:h-20 object-cover rounded-lg mr-4"
              />
              <h3 className="font-comfortaa sm:font-light text-sm md:text-base text-neutral-50">
                {article.title}
              </h3>
              <span
                className="delete-button text-lg sm:text-xl md:text-2xl text-purple-400 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBookmark(article);
                }}
              >
                <i className="fa-regular fa-circle-xmark"></i>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
