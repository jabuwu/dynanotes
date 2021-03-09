resource "aws_iam_user" "notes" {
  name = var.prefix
}

resource "aws_iam_access_key" "notes" {
  user = aws_iam_user.notes.name
}

resource "aws_iam_user_policy" "notes" {
  name = var.prefix
  user = aws_iam_user.notes.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/${var.prefix}-*",
        "arn:aws:dynamodb:us-east-1:*:table/${var.prefix}-*/index/*"
      ]
    }
  ]
}
EOF

}