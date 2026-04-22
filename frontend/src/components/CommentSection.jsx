import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  User as UserIcon,
  RefreshCw
} from "lucide-react";
import api from "../api/axiosConfig";
import { formatDistanceToNow } from "date-fns";

export default function CommentSection({ ticketId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/comments/ticket/${ticketId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchComments();
    }
  }, [ticketId]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || posting || !user) return;

    try {
      setPosting(true);
      const res = await api.post("/api/comments", {
        ticketId,
        text: newComment,
        userEmail: user.email,
        userName: user.name,
        userProfilePicture: user.picture || user.profilePicture
      });
      setComments([...comments, res.data]);
      setNewComment("");
      // Notify parent or refresh list if needed
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/api/comments/${commentId}?userEmail=${user.email}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <MessageSquare size={16} className="text-indigo-400" />
          Collaboration Hub <span className="text-[10px] text-slate-500 font-medium">({comments.length} updates)</span>
        </div>
        <button onClick={fetchComments} title="Refresh discussion" className="text-slate-500 hover:text-white transition-colors">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {loading && comments.length === 0 ? (
          <div className="text-[10px] text-slate-500 font-medium tracking-wide">Syncing discussion...</div>
        ) : comments.length === 0 ? (
          <div className="text-[10px] text-slate-600 italic py-2">Start a collaborative discussion on this issue.</div>
        ) : (
          comments.map(c => (
            <div key={c.id} className="group relative flex gap-3 rounded-2xl bg-white/[0.02] p-3 border border-white/[0.03] transition-all hover:bg-white/[0.04]">
              <div className="shrink-0">
                {c.userProfilePicture ? (
                    <img src={c.userProfilePicture} alt="" className="h-6 w-6 rounded-full border border-white/10" />
                ) : (
                    <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-500">
                    {c.userName?.[0]}
                    </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-black text-indigo-400 truncate tracking-tight">{c.userName}</span>
                  <span className="text-[9px] text-slate-600 font-medium whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal break-words">{c.text}</p>
              </div>
              
              {user && (user.email === c.userEmail) && (
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-700 hover:text-red-400"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handlePost} className="relative mt-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add update or reply..."
            disabled={posting}
            className="w-full rounded-xl border border-white/5 bg-slate-800/30 py-2.5 pl-4 pr-10 text-[11px] text-white placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={!newComment.trim() || posting}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-20 transition-all"
          >
            <Send size={14} />
          </button>
        </form>
      ) : (
        <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-3 text-center text-[9px] font-black text-indigo-400 uppercase tracking-widest">
          Sign in to contribute
        </div>
      )}
    </div>
  );
}
