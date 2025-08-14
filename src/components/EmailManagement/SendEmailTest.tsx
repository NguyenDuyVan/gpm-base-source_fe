import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import { useSendEmailMutation } from "@/api/mutations/useEmailMutation";
import { SendEmailRequest } from "@/types/email";

interface SendEmailTestProps {
  templateKey: string;
}

const SendEmailTest: React.FC<SendEmailTestProps> = ({ templateKey }) => {
  const [formData, setFormData] = useState<SendEmailRequest>({
    templateKey: templateKey,
    lang: "en",
    to: "",
    data: {},
  });
  const [jsonData, setJsonData] = useState("{}");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmailMutation = useSendEmailMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJsonChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setJsonData(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setFormData((prev) => ({ ...prev, data: parsed }));
      setError(null);
    } catch (_err) {
      setError("Invalid JSON format");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;

    try {
      await sendEmailMutation.mutateAsync(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h5 className="mb-0">Test Email Template</h5>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="to">Recipient Email</Label>
            <Input
              type="email"
              id="to"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              placeholder="recipient@example.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="lang">Language</Label>
            <Input
              type="text"
              id="lang"
              name="lang"
              value={formData.lang}
              onChange={handleInputChange}
              placeholder="en"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="data">Template Variables (JSON)</Label>
            <Input
              type="textarea"
              id="data"
              name="data"
              value={jsonData}
              onChange={handleJsonChange}
              placeholder='{"name": "John", "resetLink": "https://example.com/reset"}'
              rows={5}
              invalid={!!error}
            />
            {error && <div className="invalid-feedback">{error}</div>}
            <small className="form-text text-muted">
              Enter JSON object with variables to replace in the email template
            </small>
          </FormGroup>

          {showSuccess && (
            <Alert color="success" className="mb-3">
              Email sent successfully!
            </Alert>
          )}

          <Button
            color="primary"
            type="submit"
            disabled={!!error || sendEmailMutation.isPending}
          >
            {sendEmailMutation.isPending ? (
              <>
                <Spinner size="sm" className="me-2" /> Sending...
              </>
            ) : (
              "Send Test Email"
            )}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SendEmailTest;
