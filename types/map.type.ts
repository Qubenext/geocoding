export interface IFormData {
    floor: string;
    apartment: string;
    unit: string;
}

export interface IDataList {
    id: number;
    coordinates: string;
    address: string;
    floor: string;
    apartment: string;
    unit: string;
}

export const CFormData: IFormData = {
    floor: "",
    apartment: "",
    unit: "",
};
