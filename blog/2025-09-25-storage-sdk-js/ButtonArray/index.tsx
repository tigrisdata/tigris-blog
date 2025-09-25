import BigButton from "../BigButton";

export default function ButtonArray() {
  return (
    <center>
      <p style={{ marginLeft: "auto", marginRight: "auto" }}>
        <BigButton
          color="red"
          text="📦 npm"
          href="https://www.npmjs.com/package/@tigrisdata/storage"
        />
        <BigButton
          color="teal"
          text="💻 GitHub"
          href="https://github.com/tigrisdata/storage"
        />
        <BigButton
          color="green"
          text="📓 Examples"
          href="https://github.com/tigrisdata-community/storage-sdk-examples"
        />
        <BigButton
          color="gray"
          text="🤓 Docs"
          href="https://www.tigrisdata.com/docs/sdks/tigris/"
        />
      </p>
    </center>
  );
}
