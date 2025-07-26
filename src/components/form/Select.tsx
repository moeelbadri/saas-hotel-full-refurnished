"use client";
import styled from "styled-components";

const StyledSelect = styled.select<{ type?: string }>`
    font-size: 1.4rem;
    padding: 0.8rem 1.2rem;
    border: 1px solid ${(props) =>
        props.type === "white"
            ? "var(--color-grey-100)"
            : "var(--color-grey-300)"};
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-0);
    font-weight: 500;
    box-shadow: var(--shadow-sm);

    @media (max-width: 1200px) {
        padding: 1rem 1.4rem;
        font-size: 1.4rem;
    }

    @media (max-width: 768px) {
        padding: 1.2rem 1.6rem;
        font-size: 1.6rem;
        min-height: 4.4rem; /* Better touch target */
        border-radius: var(--border-radius-md);
    }

    @media (max-width: 480px) {
        padding: 1.4rem 1.8rem;
        font-size: 1.6rem;
        min-height: 4.8rem; /* Even better touch target */
        width: 100%;
        box-sizing: border-box;
    }
`;

type SelectProps = {
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    type?: "white";
};

function Select({ options, value, onChange, ...props }: SelectProps) {
    return (
        <StyledSelect value={value} onChange={onChange} {...props}>
            {options.map((option) => (
                <option value={option.value} key={option.value}>
                    {option.label}
                </option>
            ))}
        </StyledSelect>
    );
}

export default Select;
