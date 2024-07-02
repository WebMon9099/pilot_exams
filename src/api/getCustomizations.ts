import { api } from '../clients';
import { Customization, DBCustomization } from '../types';

function convertToDateObject(date_str:any){
  if (date_str == undefined || date_str == null || date_str == "") return new Date();
  // Parse the date string into its components
  const parts = date_str.split(/[- :]/);
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Month is zero-based
  const day = parseInt(parts[2]);
  const hour = parseInt(parts[3]);
  const minute = parseInt(parts[4]);
  const second = parseInt(parts[5]);

  // Create a new Date object with UTC timezone
  return new Date(Date.UTC(year, month, day, hour, minute, second));

}
async function getCustomizations(examId: string): Promise<Customization[]> {
  try {
    const { data } = await api.get<DBCustomization[]>(
      `/get-user-customizations.php?exam-id=${examId}`
    );

    return data.map((customization) => ({
      ...customization,
      // time_added: new Date(`${customization.time_added} UTC`),
      time_added: convertToDateObject(customization.time_added),
      duration: parseInt(customization.duration),
      question_quantity: parseInt(customization.question_quantity),
      copilot_activated: customization.copilot_activated === '1',
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
export default getCustomizations;
