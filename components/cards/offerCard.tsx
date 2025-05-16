import { Box as MUIBox, CardMedia } from "@mui/material";
import Link from "next/link";
import React from "react";

const OfferCard = ({ image, id }: { image: string, id: string }): JSX.Element => {
    return (
        <MUIBox
            key={id}
            sx={{
                width: "100%",
                maxWidth: "480px",
                height: "157px",
                position: "relative",
            }}
        >
            <Link href={`/stores/${id}`} className=" cursor-pointer w-[480px] h-[157px] aspect-square ">
                <MUIBox
                    component="div"
                    sx={
                        {
                            backgroundImage: `url(${image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }
                    }
                    className="w-full max-w-[480px] h-full max-h-[157px] object-contain absolute top-0 left-0"
                />
            </Link>
        </MUIBox>
    );
};

export default OfferCard;
