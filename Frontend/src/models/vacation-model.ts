export type VacationModel = {
    vacationId: number;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageName: string;
    image?: File;
    likesCount: number;
    isLiked: number;
}