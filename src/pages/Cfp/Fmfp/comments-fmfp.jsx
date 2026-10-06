import { useEffect, useState } from "react";
import DrawerParent from "../../../components/drawer/drawer-parent";
import { useAuth } from "../../../contexts/AuthContext";
import { MessageCircleMore, Send, Trash2 } from "lucide-react";
import { IMAGE_URL } from "../../../config/env";

export default function CommentsFmfp({
  isOpen,
  onClose,
  comments,
  idFolder,
  onComment,
  onDelete,
  isLoading,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchAllCommentsInFolder = async () => {
      try {
        if (comments && comments.length > 0) {
          const formattedComments = comments
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((comment) => ({
              id: comment.id,
              text: comment.contents,
              author: comment.name,
              email: comment.email,
              photo: comment.photo,
              userId: comment.idUser,
              timestamp: new Date(comment.date),
            }));

          setMessages(formattedComments);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.log(error);
        setMessages([]);
      }
    };

    if (idFolder) {
      fetchAllCommentsInFolder();
    }
  }, [idFolder, comments]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const res = await onComment(inputValue, idFolder);
      if (res.comment) {
        const newMessage = {
          id: res.comment.id,
          text: res.comment.contents,
          author: user?.name || "Vous",
          email: user?.email || "",
          userId: res.comment.idUser,
          timestamp: new Date(res.comment.date),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
      setInputValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    }

    return messageDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDeleteMessage = async (idComment) => {
    try {
      const res = await onDelete(idComment, idFolder);
      if (res.status === 200) {
        setMessages((prev) => prev.filter((msg) => msg.id !== idComment));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const imgUrl =
    `${IMAGE_URL}/img/referents`;

  return (
    <DrawerParent title="Commentaires" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500">
                    Chargement des commentaires...
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <MessageCircleMore
                    size={18}
                    className="text-gray-400 group-hover:text-blue-600"
                  />
                </div>
                <p className="font-medium text-gray-600">Aucun commentaire</p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar">
                {messages.map((message) => {
                  const isMe = message.userId === user?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`flex items-start gap-2 group ${
                          isMe ? "flex-row-reverse" : ""
                        }`}
                      >
                        {isMe && (
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="self-start opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full  hover:bg-gray-200 text-gray-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <div className="flex justify-between items-center gap-3">
                          <div>
                            <img
                              src={`${imgUrl}/${message.photo}`}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>

                          <div
                            className={`max-w-[85%] px-4 py-3 rounded-2xl break-words ${
                              isMe
                                ? "bg-blue-500 text-white rounded-br-md"
                                : "bg-gray-100 text-gray-800 rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm font-semibold mb-1">
                              {message.author}
                            </p>

                            <p className="leading-relaxed">{message.text}</p>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-gray-500 mt-2 px-1">
                        {formatDate(message.timestamp)} à{" "}
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Écrivez votre commentaire..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={16} />
              Envoyer
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </DrawerParent>
  );
}
