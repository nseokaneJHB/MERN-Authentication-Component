import React from "react";

// Components
import { Button } from "../components/Button";

// Third Party
import { useNavigate } from "react-router-dom";

export const PageNotFound = () => {
	const navigate = useNavigate();

	return (
		<div
			className="grid grid-cols-1 place-items-center px-5 sm:p-0"
			style={{ minHeight: "95%" }}
		>
			<div className="w-full p-4" style={{ maxWidth: "600px" }}>
				<p
					className="text-9xl sm:text-[15rem] text-gray-600 text-center"
					style={{
						textShadow: `
                1px 1px 0px rgba(150, 150, 150, .1),
                2px 2px 0px rgba(150, 150, 150, .1),
                3px 3px 0px rgba(150, 150, 150, .1),
                4px 4px 0px rgba(150, 150, 150, .1),
                5px 5px 0px rgba(150, 150, 150, .1),
                6px 6px 0px rgba(100, 100, 100, .1),
                7px 7px 0px rgba(100, 100, 100, .1),
                8px 8px 0px rgba(100, 100, 100, .1),
                9px 9px 0px rgba(100, 100, 100, .1),
                11px 11px 0px rgba(100, 100, 100, .1),
                12px 12px 0px rgba(100, 100, 100, .1),
                13px 13px 0px rgba(100, 100, 100, .1),
                14px 14px 0px rgba(100, 100, 100, .1),
                15px 15px 0px rgba(100, 100, 100, .1),
                16px 16px 0px rgba(100, 100, 100, .1),
                17px 17px 0px rgba(100, 100, 100, .1),
                18px 18px 0px rgba(100, 100, 100, .1),
                19px 19px 0px rgba(100, 100, 100, .1),
                20px 20px 0px rgba(100, 100, 100, .1),
                21px 21px 0px rgba(100, 100, 100, .1),
                22px 22px 0px rgba(100, 100, 100, .1),
                23px 22px 0px rgba(100, 100, 100, .1),
                24px 24px 0px rgba(100, 100, 100, .1),
                25px 25px 0px rgba(100, 100, 100, .1),
                26px 26px 0px rgba(150, 150, 150, .1),
                27px 27px 0px rgba(150, 150, 150, .1),
                28px 28px 0px rgba(150, 150, 150, .1),
                29px 29px 0px rgba(150, 150, 150, .1),
                30px 30px 0px rgba(150, 150, 150, .1)
              `,
					}}
				>
					404
				</p>
				<p className="text-xl text-gray-500 text-center">
					Looks like you're lost
				</p>
				<Button
					bStyles={
						"bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500 text-black"
					}
					bType={"button"}
					bLabel={"Go back"}
					handleOnClick={() => navigate(-1)}
				/>
			</div>
		</div>
	);
};
