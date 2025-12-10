export interface appointmentInfo {
     patientid?: string | null,
    doctorid: string,
    appointmentdate: string,
    starttime: string,
    endtime: string,
    reason?: string,
    prescription?: string| null,
}