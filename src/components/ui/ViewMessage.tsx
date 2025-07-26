"use client";
import styled from "styled-components";
import { Button } from "@/components/ui";
import { Heading } from "@/components/typography";
import { formatCurrency } from "@/utils/helpers";
import { Form, FormRow, Input } from "../form";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import toast from "react-hot-toast";

type Props = {
    resourceName: { content: string , topic : string };
    onConfirm: () => void;
    disabled: boolean;
    isSuccess?: boolean;
    onCloseModal?: () => void;
};

export default function ViewMessage({
    resourceName,
    onConfirm,
    disabled,
    onCloseModal,
}: Props) {
    const Language = useSettingsStore(state => state.Language);
    return (
       <Form
            onSubmit={onConfirm}
            type={onCloseModal ? "modal" : "regular"}
            iswidestring="true">
            <Heading as="h3">Viewing Message</Heading>
                 <FormRow label={Language === "en" ? "Topic" : "عنوان الرسالة"}>
                        <Input
                            type="text"
                            value={resourceName.topic}
                            disabled
                        />
                    </FormRow>
                   <FormRow label={Language === "en" ? "Message" : "نص الرسالة"}>
                        <Input
                            type="text"
                            value={resourceName.content}
                            disabled
                        />
                    </FormRow>
            <div>
                <Button
                    variant="primary"
                    disabled={disabled}
                    onClick={() => {
                        onConfirm();
                        onCloseModal?.();
                    }}
                >
                    Close
                </Button>
            </div>
       </Form>
    );
}
