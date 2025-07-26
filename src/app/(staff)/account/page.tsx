import UpdatePasswordForm from "@/features/authentication/UpdatePasswordForm";
import UpdateUserDataForm from "@/features/authentication/UpdateUserDataForm";
import { Heading } from "@/components/typography";
import { Row } from "@/components/layout";

function Account() {
  return (
    <>
      <Heading style={{ textAlign: "center"}} as="h1">Update your account</Heading>

      <Row>
        <Heading style={{ textAlign: "center", marginTop: "2rem" }} as="h3">Update user data</Heading>
        <UpdateUserDataForm />
      </Row>

      <Row>
        <Heading style={{ textAlign: "center", marginTop: "1rem" }} as="h3">Update password</Heading>
        <UpdatePasswordForm />
      </Row>
    </>
  );
}

export default Account;
