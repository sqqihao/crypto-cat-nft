import type { FC } from "react";

import { Wrap } from "@chakra-ui/react";

import { Loading, TabHeader } from "@/components/elements";
import { useStore } from "@/store/store";

import DisplayCat from "./components/DisplayCat";
import NoCatFound from "./components/NoCatFound";

const ShowContent: FC = () => {
  const { userCats } = useStore();

  return (
    <>
      <TabHeader title="NFT猫库存" description="显示所有的NFT猫." />

      {!userCats && <Loading />}

      {userCats?.length === 0 ? (
        <NoCatFound />
      ) : (
        <Wrap w={"80%"} justify="center" m="auto">
          {userCats?.map((cat: Cat) => {
            return (
              <DisplayCat
                key={cat.indexId}
                dnaBN={cat.genes}
                id={Number(cat.indexId)}
                generation={Number(cat.generation)}
              />
            );
          })}
        </Wrap>
      )}
    </>
  );
};

export default ShowContent;
