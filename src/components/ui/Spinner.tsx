"use client";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

// Overlay container to cover the viewport
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Ensures it overlays other elements */
`;
// Spinner styling
const SpinnerO = styled.div`
  width: 6.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
      farthest-side,
      var(--color-brand-600) 94%,
      #0000
    )
    top/10px 10px no-repeat,
    conic-gradient(#0000 30%, var(--color-brand-600));
  mask: radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0);
  -webkit-mask: radial-gradient(
    farthest-side,
    #0000 calc(100% - 10px),
    #000 0
  );
  animation: ${rotate} 2.5s infinite linear;
`;
const Spinner = styled.div`
    margin: 4.8rem auto;

    width: 6.4rem;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(
                farthest-side,
                var(--color-brand-600) 94%,
                #0000
            )
            top/10px 10px no-repeat,
        conic-gradient(#0000 30%, var(--color-brand-600));
    mask: radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0);
    -webkit-mask: radial-gradient(
        farthest-side,
        #0000 calc(100% - 10px),
        #000 0
    );
    animation: ${rotate} 3.5s infinite linear;
`;
// Usage
export default Spinner;