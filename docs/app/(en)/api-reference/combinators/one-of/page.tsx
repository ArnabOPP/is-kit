import { ApiReferencePager } from '@/components/api-reference/pager';
import { CodeBlock } from '@/components/code/code-block';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { API_REFERENCE_PATHS, createApiMetadata } from '@/lib/api-metadata';

export const metadata = createApiMetadata(API_REFERENCE_PATHS.oneOf);

const sample = `import { oneOf, isString, isNumber } from 'is-kit';

// Use varargs with oneOf for union guard composition
const isStringOrNumber = oneOf(isString, isNumber);
isStringOrNumber('x'); // true
isStringOrNumber(1); // true
isStringOrNumber(true); // false`;

const unionSample = `import { oneOf } from 'is-kit';

type AstNode =
  | { kind: 'identifier'; text: string }
  | { kind: 'literal'; value: string }
  | { kind: 'call' };

type Identifier = Extract<AstNode, { kind: 'identifier' }>;
type Literal = Extract<AstNode, { kind: 'literal' }>;

const isIdentifier = (node: AstNode): node is Identifier =>
  node.kind === 'identifier';
const isLiteral = (node: AstNode): node is Literal => node.kind === 'literal';

// Refine<AstNode, Identifier | Literal>
const isIdentifierOrLiteral = oneOf(isIdentifier, isLiteral);

declare const node: AstNode;
if (isIdentifierOrLiteral(node)) {
  // node: Identifier | Literal
  // The members stay separate, so narrow further on node.kind if needed.
  if (node.kind === 'identifier') {
    node.text; // string
  }
}`;

const precisionSample = `import { oneOf } from 'is-kit';

type AstNode =
  | { kind: 'identifier'; text: string }
  | { kind: 'literal'; value: string }
  | { kind: 'call' };

// This guard only promises the broad AstNode type.
const isNamedNode = (node: AstNode): node is AstNode =>
  node.kind !== 'call';

const isNamedOrCall = oneOf(isNamedNode, (node: AstNode): node is AstNode =>
  node.kind === 'call'
);

declare const node: AstNode;
if (isNamedOrCall(node)) {
  // node: AstNode
  // oneOf cannot recover Identifier | Literal from a guard that returns AstNode.
}`;

export default function OneOfPage() {
  return (
    <Stack variant='main' className='container mx-auto px-4 py-10' gap='xl'>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h1'>oneOf</Heading>
          <Paragraph>
            Guard that passes when any provided guard passes.
          </Paragraph>
        </Stack>
        <CodeBlock code={sample} language='ts' />
      </Stack>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h2'>Discriminated unions</Heading>
          <Paragraph>
            When the guards share a known input type, <code>oneOf</code>{' '}
            preserves the union of their guarded output types. It does not
            collapse the members to a common supertype, so each member stays
            available for further narrowing inside the guarded branch.
          </Paragraph>
        </Stack>
        <CodeBlock code={unionSample} language='ts' />
      </Stack>
      <Stack variant='section' gap='md'>
        <Stack gap='xs'>
          <Heading variant='h2'>Precision comes from your guards</Heading>
          <Paragraph>
            <code>oneOf</code> preserves the precision exposed by the guards you
            pass in. If an individual guard already returns a broader type, it
            cannot reconstruct the narrower members from it. Give each guard the
            most specific type predicate you want to keep.
          </Paragraph>
        </Stack>
        <CodeBlock code={precisionSample} language='ts' />
      </Stack>
      <ApiReferencePager currentHref={API_REFERENCE_PATHS.oneOf} />
    </Stack>
  );
}
