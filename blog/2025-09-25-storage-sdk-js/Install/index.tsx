import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export default function Install() {
  return (
    <Tabs>
      <TabItem value="npm" label="npm">
        <CodeBlock language="bash">{`npm install --save @tigrisdata/storage`}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="Yarn">
        <CodeBlock language="bash">{`yarn add @tigrisdata/storage`}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
