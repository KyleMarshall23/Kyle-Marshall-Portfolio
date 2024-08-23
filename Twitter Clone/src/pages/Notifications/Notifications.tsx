import React, { useEffect, useState } from "react";
import {
  PostNotification,
  LikedNotification,
  FollowNotifications,
  RetweetNotifications, 
  CommentNotification,
} from "@components/index";
import { useNavigate } from "react-router-dom";
import { isUserLoggedIn, getUserData, fetchTweets } from "@services/index";
import { getUserNotifications, getAllComments, fetchAllProfiles } from "@services/index";


interface NotificationsProps {}
const Notifications: React.FC<NotificationsProps> = () => {
  const [activeTab, setActiveTab] = useState("all");
  // const [postnotifications] = useState<any[]>(mockNotifications);
  // const [likedNotfications] = useState<any[]>(mockLikedNotifications);
  const navigate = useNavigate(); // Initialize useNavigate hook
  // const [mentions] = useState<any[]>(mockMentions);
  const [notifications, setNotifications] = useState<any[]>([]); // Initialize notifications state
  const [followNotifications, setFollowNotifications] = useState<any[]>([]);
  const [postNotifications, setPostNotifications] = useState<any[]>([]);
  const [commentNotifications, setCommentNotifications] = useState<any[]>([]);
  const [likedNotifications, setLikedNotifications] = useState<any[]>([]);
  const [retweetNotifications, setRetweetNotifications] = useState<any[]>([]);
  const [tweetNotifications] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allComments] = useState<any[]>([]);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const checkUser = async () => {
      const result = await isUserLoggedIn();
      if (!result) {
        navigate("/home");
        return;
      }
      
      const userData = await getUserData();
      if (!userData) {
        navigate("/home");
        return;
      }
      fetchTweets().then((tweetNotifications) => {
        // Update tweet notifications state
        setNotifications(tweetNotifications);
        // console.log(tweetNotifications);
        
      }); 
      const users = await fetchAllProfiles();
      setAllUsers(users);
      const comments = await getAllComments();
      setCommentNotifications(comments);
      // console.log(userData?.user_metadata.user_id);
      const fetchedNotifications = await getUserNotifications(userData?.user_metadata.user_id);
      // console.log(fetchedNotifications);
      if(fetchedNotifications){
        setNotifications(fetchedNotifications);
      } else {
        console.error("Failed to fetch notifications")
      }
      
    };
    // CreateFollowNotification(5000, 57);
    // CreateLikeNotification(484, 5000);
    // CreateCommentNotification(484, 5000);
    // CreateRetweetNotification(484, 5000);
    // CreateTweetNotification(484);
    checkUser();
  }, [navigate]);
  
  useEffect(() => {
   
    // Processing notifications when notifications state changes
    // console.log(notifications);
    for (let i = 0; i < (notifications?.length ?? 0); i++) {
      // console.log(notifications[i].Type_Id);
    
      // Find the tweet corresponding to the notification
      const tweet = tweetNotifications.find((tweet) => tweet.Tweet_Id === notifications[i].Tweet_Id);
      notifications[i].avatarUrl = allUsers.find((user) => user.User_Id === notifications[i].Avatar_Url_Id);
      // Update notification with tweet content if found
      if (tweet) {
        notifications[i].tweet = tweet.Content;
      }
      switch (notifications?.[i]?.Type_Id ?? "") {
        case 1: //New_Follow
          setFollowNotifications((prev) => [...prev, notifications[i]]);
          break;
        case 2: //New_Post
          setPostNotifications((prev) => [...prev, notifications[i]]);
          break;
        case 3: //New_Comment
          notifications[i].comment = allComments.find((user) => user.User_Id === notifications[i].Comment_Id && user.Tweet_Id === notifications[i].Tweet_Id);
          setCommentNotifications((prev) => [...prev, notifications[i]]);
          break;
        case 4: //New_Like
          setLikedNotifications((prev) => [...prev, notifications[i]]);
          break;
        case 5: //Retweet
          setRetweetNotifications((prev) => [...prev, notifications[i]]);
          break;
        default:
          break;
      }
    }
    // console.log(notifications);
  }, [notifications, setFollowNotifications, setPostNotifications, setCommentNotifications, setLikedNotifications, setRetweetNotifications, allComments, allUsers, tweetNotifications]);
  // need to add tabs: Likes, Follows, Comments, Retweets, Posts
  // Need to modify the layout of data being passed for different types of tweets
  return (
   
        
        <div className="main-content m-0 p-0 border dark:border-neutral-800">
          <div className="flex flex-col w-full m-0 p-0 justify-center">
            {/* Notification Header */}
            <div className="flex justify-between items-center p-2 dark:text-white">
              <h1 className="text-2xl font-bold">Notifications</h1>
            </div>
            {/* Notifications Tabs */} 
            {/* // console.log(followNotifications);
                // console.log(postnotifications);
                // console.log(commentNotifications);
                // console.log(likedNotfications);
                // console.log(retweetNotifications); */}
            <div className="flex w-full justify-around border-b border-gray-200 dark:border-neutral-800 items-center">
              <div className="w-full">
                <div className="flex ">
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 dark:hover:bg-neutral-900 ${
                      activeTab === "all" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("all")}
                  >
                    All
                  </button>
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 dark:hover:bg-neutral-900 ${
                      activeTab === "follows" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("follows")}
                  >
                    Follows
                  </button>
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 dark:hover:bg-neutral-900 ${
                      activeTab === "posts" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("posts")}
                  >
                    Posts
                  </button>
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 dark:hover:bg-neutral-900 ${
                      activeTab === "comments" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("comments")}
                  >
                    Comments
                  </button>
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 dark:hover:bg-neutral-900 ${
                      activeTab === "likes" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("likes")}
                  >
                    Likes
                  </button>
                  <button
                    className={`w-1/3 py-4 text-base font-semibold hover:bg-gray-200 dark:hover:bg-neutral-900 ${
                      activeTab === "retweets" ? "text-blue-500" : "text-gray-500"
                    }`}
                    onClick={() => handleTabClick("retweets")}
                  >
                    Retweets
                  </button>
                </div>
                <div>
                  {activeTab === "all" && (
                    <div>
                      {notifications.length === 0 ? ( //{notifications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no notifications
                        </p>
                      ) : (
                        notifications
                          .sort((a, b) => new Date(b.Created_at).getTime() - new Date(a.Created_at).getTime())
                          .map((notification, index) => (
                            <FollowNotifications
                              key={index}
                              id={index}
                              avatarUrl={notification.avatarUrl?.Img_Url}
                              description={notification.Content}
                            />
                          ))
                      )}
                      {/* {" "}
                      {likedNotfications.map((notification, index) => (
                        <LikeNotification
                          key={index}
                          id={index}
                          description={notification.message}
                          tweet={notification.tweet}
                          avatarUrl={notification.avatarUrl}
                        />
                      ))}{" "}
                      {" "}
                      {mentions.map((mention, index) => (
                        <Mention
                          key={index}
                          id={index}
                          name={mention.Name}
                          username={mention.Username}
                          text={mention.Content}
                          imageUrl={mention.avatarUrl}
                          replyToUsername={mention.MentionedUser}
                          saves={1000}
                          comments={100}
                          retweets={100}
                          likes={100}
                          timeDisplay={getTimeDisplay(mention.Created_at)}
                        />
                      ))} */}
                    </div>
                  )}
                  {activeTab === "follows" && (
                    <div>
                      {followNotifications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no notifications
                        </p>
                      ) : (
                        followNotifications
                        .sort((a, b) => new Date(b.Created_at).getTime() - new Date(a.Created_at).getTime())
                        .map((notification, index) => (
                          <FollowNotifications
                              key={index}
                              id={index}
                              description={notification.Content}
                              avatarUrl={notification.avatarUrl?.Img_Url}
                            />
                        ))
                      )}
                    </div>
                  )}
                  {activeTab === "posts" && (
                    <div>
                     {postNotifications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no notifications
                        </p>
                      ) : (
                        postNotifications
                        .sort((a, b) => new Date(b.Created_at).getTime() - new Date(a.Created_at).getTime())
                        .map((notification, index) => (
                          <PostNotification
                              key={index}
                              id={index}
                              avatarUrl={notification.avatarUrl?.Img_Url}
                              description={notification.Content}
                              tweet={notification.tweet}
                            />
                        ))
                      )}
                    </div>
                  )}
                  {activeTab === "comments" && (
                    <div>
                      {commentNotifications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no notifications
                        </p>
                      ) : (
                        commentNotifications
                        .sort((a, b) => new Date(b.Created_at).getTime() - new Date(a.Created_at).getTime())
                        .map((notification, index) => (
                          <CommentNotification
                              key={index}
                              id={index}
                              avatarUrl={notification.avatarUrl?.Img_Url}
                              description={notification.Content}
                              comment={notification?.comment?.Content?.length > 20 ? notification?.comment?.Content.slice(0, 20) + '...' : notification?.comment?.Content}
                            />
                        ))
                      )}
                    </div>
                  )}
                  {activeTab === "likes" && (
                    <div>
                      {likedNotifications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no notifications
                        </p>
                      ) : (
                        likedNotifications
                        .sort((a, b) => new Date(b.Created_at).getTime() - new Date(a.Created_at).getTime())
                        .map((notification, index) => (
                          <LikedNotification
                          key={index}
                          id={index}
                          description={notification.Content}
                          avatarUrl={notification.avatarUrl?.Img_Url}
                          tweet={notification.tweet}
                        />
                        ))
                      )}
                    </div>
                  )}
                  {activeTab === "retweets" && (
                    <div>
                      {retweetNotifications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          You have no notifications
                        </p>
                      ) : (
                        retweetNotifications
                        .sort((a, b) => new Date(b.Created_at).getTime() - new Date(a.Created_at).getTime())
                        .map((notification, index) => (
                          <RetweetNotifications
                          key={index}
                          id={index}
                          description={notification.Content}
                          avatarUrl={notification.avatarUrl?.Img_Url}
                          tweet={notification.tweet}
                        />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default Notifications;
