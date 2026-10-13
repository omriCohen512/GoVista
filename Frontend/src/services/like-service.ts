
import axios from "axios";
import { appConfig } from "../utils/app-config";

class LikeService {

    // Add a like to the selected vacation.
    public async addLike(vacationId: number): Promise<void> {
        await axios.post(appConfig.likesUrl + vacationId);
    }

    // Remove a like from the selected vacation.
    public async deleteLike(vacationId: number): Promise<void> {
        await axios.delete(appConfig.likesUrl + vacationId);
    }

}

export const likeService = new LikeService();
