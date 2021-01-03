import { Prisma } from "@prisma/client";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


type FullPost = Prisma.PostGetPayload<{
    include: { user: true, subreddit: true }
}>

const SubredditPost = ({ post }: { post: FullPost }) => {
    return (
        <div className="w-full bg-white  rounded-md p-4 mt-4 ">
            <div className="flex">
                <div className="flex flex-col mr-6 items-center">
                    <FontAwesomeIcon icon={faThumbsUp} className="cursor-pointer text-gray-600 hover:text-red-500" />
                    <p>3</p>
                    <FontAwesomeIcon icon={faThumbsDown} className="cursor-pointer text-gray-600 hover:text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Posted by u/{post.user.name}</p>
                    <p className="text-3xl text-gray-900">{post.title}</p>
                    <p className="text-xl text-gray-900">{post.body}</p>
                    <div>
                        <p>
                            {/*comment icon */} {/*comment count*/} comments
                    </p>
                        <p>Share</p>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default SubredditPost;