import { api } from "../clients";

async function getActivityInfo() {
  try {
    const { data } = await api.get<{
      id: string;
      name: string;
      help_hyperlink: string;
    }>("../get-activity-info.php");

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getActivityInfo;
