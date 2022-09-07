const UserCard = () => {
  return (
    <div className="cardContainer">
      <div className="userCard">
        <div className="profileHead">
          <div className="profilePicture rounded-full h-16 w-16 flex items-center justify-center bg-grey-500">
            picture
          </div>
          <div className="profileMetaData">meta</div>
        </div>
        <div className="swipeButtons">
          <div className="btn swipeNo bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            no
          </div>
          <div className="btn swipeYes bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            yes
          </div>
        </div>
        <div className="profileBlurb">
          <div className="blurb firstBlurb">1</div>
          <div className="blurb secondBlurb">2</div>
          <div className="blurb thirdBlurb">3</div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
