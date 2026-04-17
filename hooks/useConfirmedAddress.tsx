import React, {useState} from "react";
import {CFormData, IDataList} from "@/types/map.type";

interface IProps {
    location: { lng: number; lat: number } | null;
    reversed: string;
    setDatalist: React.Dispatch<React.SetStateAction<IDataList[]>>;
}

export default function useConfirmedAddress({ location, reversed, setDatalist }: IProps) {
    const [formData, setFormData] = useState(CFormData);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const item = {
            id: Date.now(),
            coordinates: location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : "",
            address: reversed,
            floor: formData.floor,
            apartment: formData.apartment,
            unit: formData.unit,
        } as IDataList;
        setDatalist((prev) => [item, ...prev]);
    };

    return {formData, setFormData, handleSubmit}
}