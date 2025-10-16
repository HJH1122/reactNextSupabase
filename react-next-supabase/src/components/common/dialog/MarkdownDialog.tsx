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

function MarkdownDialog() {
    const [open, setOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string | undefined>("hello");
    const { toasts } = useSonner();

    const onSubmit = async () => {
        if (!title || !content) {
            toast("내용을 입력해주세요.", {
                description: "제목, 날짜, 콘텐츠 값을 모두 작성해주세요.",
            });
            return;
        } else {
            const { data, error, status } = await supabase
                .from("todos")
                .insert([{ title: title, content: content }])
                .select();

            if (error) {
                console.log(error);
                toast("에러가 발생했습니다.", {
                    description: "콘솔 창에 출력된 에러를 확인하세요.",
                });
            }
            if (status === 201) {
                toast("생성 완료", {
                    description: "작성한 글이 저장되었습니다.",
                });

                setOpen(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <span className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer">
                    Add Contents
                </span>
            </DialogTrigger>
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
