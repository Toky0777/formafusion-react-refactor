import axios from '../../../config/axios';

export const fetchFolders = async (date) => {
    try {
        const response = await axios.get(`/cfp/gallery/folder/${date}`);
        return response.data

    } catch (error) {
        console.log(error);

    }
}