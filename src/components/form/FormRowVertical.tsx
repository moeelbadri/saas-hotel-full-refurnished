"use client";
import styled from "styled-components";

const StyledFormRow = styled.div<{ dir: "ltr" | "rtl" }>`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1.2rem 0;
    direction: ${(props) => props.dir};
`;

const Label = styled.label`
    font-weight: 500;
`;

const Error = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);
`;

type FormRowProps = {
    label?: string;
    error?: string;
    style?: React.CSSProperties;
    children: React.ReactElement<{ id?: string }>; // Ensure children has an id prop
    dirOverride?: "ltr" | "rtl"; // Allow manual override
};

function FormRowVertical({ label, error, style, children, dirOverride }: FormRowProps) {
    const lang = typeof window !== "undefined" ? localStorage.getItem("lang") || "en" : "en";
    const direction = dirOverride || (lang === "ar" ? "rtl" : "ltr");

    return (
        <StyledFormRow dir={direction} style={style}>
            {label && <Label htmlFor={children.props.id}>{label}</Label>}
            {children}
            {error && <Error>{error}</Error>}
        </StyledFormRow>
    );
}

export default FormRowVertical;
