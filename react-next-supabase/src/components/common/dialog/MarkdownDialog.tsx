"use client";

import { Checkbox } from "@/components/ui/checkbox";
import styles from "./MarkdownDialog.module.scss";
import MDEditor from "@uiw/react-md-editor";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import LabelCalendar from "../calender/LabelCalendar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSonner, toast } from "sonner";
import { supabase } from "@/utils/supabase";
import { usePathname } from "next/navigation";

interface Todo {
    id: number;
    title: string;
    start_date: string | Date;
    end_date: string | Date;
    contents: BoardContent[];
}

interface BoardContent {
    boardId: string | number;
    isCompleted: boolean;
    title: string;
    startDate: string | Date;
    endDate: string | Date;
    content: string;
}

interface Props {
    data: BoardContent;
}

function MarkdownDialog({ data }: Props) {
    const pathname = usePathname();
    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [content, setContent] = useState<string | undefined>("hello");
    const { toasts } = useSonner();

    const onSubmit = async () => {
        if (!title || !startDate || !endDate || !content) {
            toast("내용을 입력해주세요.", {
                description: "제목, 날짜, 콘텐츠 값을 모두 작성해주세요.",
            });
            return;
        } else {
            let { data: todos } = await supabase.from("todos").select("*");

            if (todos !== null) {
                todos.forEach(async (item: Todo) => {
                    if (item.id === Number(pathname.split("/")[2])) {
                        item.contents.forEach((element: BoardContent) => {
                            if (element.boardId === "ezmrps49FGKlW3TtzoDwx") {
                                element.title = title;
                                element.content = content;
                                element.startDate = startDate;
                                element.endDate = endDate;
                            } else {
                                element.title = element.title;
                                element.content = element.content;
                                element.startDate = element.startDate;
                                element.endDate = element.endDate;
                            }
                        });

                        const { data, error, status } = await supabase
                            .from("todos")
                            .update([{ contents: item.contents }])
                            .eq("id", pathname.split("/")[2]);

                        if (error) {
                            console.log(error);
                            toast("에러가 발생했습니다.", {
                                description:
                                    "콘솔 창에 출력된 에러를 확인하세요.",
                            });
                        }
                        if (status === 204) {
                            toast("수정 완료", {
                                description: "작성한 글이 수정되었습니다.",
                            });

                            setOpen(false);
                        }
                    }
                });
            } else {
                return;
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {data.title ? (
                <DialogTrigger asChild>
                    <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
                        Update Contents
                    </span>
                </DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
                        Add Contents
                    </span>
                </DialogTrigger>
            )}

            <DialogContent className="!max-w-fit">
                <DialogHeader>
                    <DialogTitle>
                        <div className={styles.dialog__titleBox}>
                            <Checkbox className="w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Write a title for your board."
                                className={styles.dialog__titleBox__title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />
                        </div>
                    </DialogTitle>
                    <div className={styles.dialog__calendarBox}>
                        <LabelCalendar label="From" />
                        <LabelCalendar label="To" />
                    </div>
                    <Separator />
                    <div className={styles.dialog__markdown}>
                        <MDEditor
                            value={content}
                            height={100 + "%"}
                            onChange={setContent}
                        />
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <div className={styles.dialog__buttonBox}>
                        <DialogClose asChild>
                            <Button
                                variant={"ghost"}
                                className="font-normal text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type={"submit"}
                            className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
                            onClick={onSubmit}
                        >
                            Done
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default MarkdownDialog;
