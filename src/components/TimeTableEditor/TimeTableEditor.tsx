import * as htmlToImage from "html-to-image";
import React, { useState } from "react";

interface Data {
  day: number;
  isHoliday: boolean;
  time: string;
  description: string;
}

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const profileImageHeight = 720;
const profileImageWidth = 540;

const TimeTableEditor: React.FC = () => {
  const [scale, setScale] = useState(0.5);
  const [data, setData] = useState<Data[]>([
    { day: 0, isHoliday: false, time: "09:00", description: "상세 내용" },
    { day: 1, isHoliday: false, time: "09:00", description: "상세 내용" },
    { day: 2, isHoliday: false, time: "09:00", description: "상세 내용" },
    { day: 3, isHoliday: false, time: "09:00", description: "상세 내용" },
    { day: 4, isHoliday: false, time: "09:00", description: "상세 내용" },
    { day: 5, isHoliday: false, time: "09:00", description: "상세 내용" },
    { day: 6, isHoliday: false, time: "09:00", description: "상세 내용" },
  ]);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const node = document.getElementById("timetable");
    if (!node) return;

    htmlToImage
      .toPng(node, {
        width: 1280,
        height: 720,
        pixelRatio: 1,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "weekly-timetable.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("이미지 생성 실패:", err);
      });
  };

  const containerWidth = 1280 * scale;
  const containerHeight = 720 * scale;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-4 flex justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600 font-medium">
            미리보기 배율: {scale.toFixed(1)}x
          </label>
          <input
            type="range"
            min={0.3}
            max={2}
            step={0.1}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-64"
          />
        </div>
        <button
          onClick={downloadImage}
          className="px-4 py-2 bg-[#4e4d71] text-white rounded hover:bg-[#3d3d59]"
        >
          이미지로 저장 (1280x720)
        </button>
      </div>
      <div className="flex grow">
        <div className=" flex justify-center items-center grow">
          <div
            className="border rounded shadow bg-gray-50"
            style={{
              width: containerWidth,
              height: containerHeight,
              transition: "width 0.3s, height 0.3s",
              overflow: "visible",
            }}
          >
            <div
              id="timetable"
              className="w-[1280px] h-[720px] bg-white box-border text-[26px] select-none font-sans origin-top-left relative overflow-hidden"
              style={{
                transform: `scale(${scale})`,
              }}
            >
              <div className="w-full h-full bg-[#5868a2] flex flex-col">
                <div className="absolute left-20 top-20 -rotate-6 w-[640px] h-[640px] bg-[#4a5889] grid grid-cols-3 grid-rows-3 gap-[10px] justify-center items-center rounded-md z-20">
                  <div className="col-span-2 row-span-1 w-full h-full">
                    <div className="w-full h-full bg-[#3a466e] flex flex-col justify-center items-center text-white text-center">
                      TITLE
                    </div>
                  </div>

                  {data.map((time) => (
                    <>
                      {time.isHoliday ? (
                        <div
                          key={time.day}
                          className="bg-[#8a3747] w-full h-full flex flex-col justify-center items-center"
                        >
                          <p className="text-white text-center">
                            {weekdays[time.day]}
                          </p>
                          <p className="text-white text-center">휴방</p>
                        </div>
                      ) : (
                        <div
                          key={time.day}
                          className="bg-[#3a466e] w-full h-full flex flex-col justify-center items-center"
                        >
                          <p className="text-white text-center">
                            {weekdays[time.day]}
                          </p>
                          <p className="text-white text-center">{time.time}</p>
                          <p className="text-white text-center">
                            {time.description}
                          </p>
                        </div>
                      )}
                    </>
                  ))}
                </div>
                <div
                  className={`h-[${profileImageHeight}px] w-[${profileImageWidth}px] bg-[#4a5889] absolute right-20 top-10 rotate-10 z-10 rounded-md flex justify-center items-center text-white`}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center">
                      <p className="text-white text-center">
                        프로필 이미지 자리
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/3 h-full flex flex-col justify-center">
          <div className="flex flex-col gap-2 w-full">
            {data.map((day, index) => (
              <div
                key={day.day}
                className="flex justify-center items-center gap-4 p-4 bg-gray-100 w-full"
              >
                <p>{day.day}</p>
                <button
                  className={`shrink-0 bg-gray-300 rounded-md p-2 cursor-pointer hover:brightness-90 ${
                    day.isHoliday ? "bg-gray-600 text-white" : ""
                  }`}
                  onClick={() => {
                    const newData = [...data];
                    newData[index].isHoliday = !newData[index].isHoliday;
                    setData(newData);
                  }}
                >
                  휴일
                </button>
                <input
                  id={`time-${index}`}
                  type="time"
                  className=" bg-gray-200 rounded-md p-2"
                  value={day.time}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].time = e.target.value;
                    setData(newData);
                  }}
                />
                <input
                  value={day.description}
                  className={`bg-gray-200 rounded-md p-2  `}
                  type={"text"}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].description = e.target.value;
                    setData(newData);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 justify-center items-center py-8">
            <div>
              <label
                htmlFor="file-upload"
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
              >
                프로필 사진 업로드
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div
              className={`bg-[#2d2d2d] text-white rounded-md flex justify-center items-center`}
              style={{
                width: profileImageWidth / 5,
                height: profileImageHeight / 5,
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <p className="text-white text-center">미리보기</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTableEditor;
