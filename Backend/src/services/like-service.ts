
import { dal } from "../utils/dal";

// Handles vacation likes in the database:
class LikeService {

    // Check whether a user has already liked a vacation:
    public async isLiked(userId: number, vacationId: number): Promise<boolean> {
        const sql = "select * from likes where userId = ? and vacationId = ?";
        const values = [userId, vacationId];
        const likes = await dal.execute(sql, values) as any[];
        return likes.length > 0;
    }

    // Add a like for a specific user and vacation:
    public async addLike(userId: number, vacationId: number): Promise<void> {
        const sql = "insert into likes(userId, vacationId) values(?, ?)";
        const values = [userId, vacationId];
        await dal.execute(sql, values);
    }

    // Remove a user's like from a vacation:
    public async deleteLike(userId: number, vacationId: number): Promise<void> {
        const sql = "delete from likes where userId = ? and vacationId = ?";
        const values = [userId, vacationId];
        await dal.execute(sql, values);
    }

}

export const likeService = new LikeService();
