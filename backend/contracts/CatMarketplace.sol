// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {CatContract} from "./CatContract.sol";

interface ICatMarketplace {
    event MarketTransaction(string TxType, address owner, uint256 tokenId);
    event CatAddressUpdated(address oldCatAddress, address newCatAddress);

    function setCatContract(address _catContractAddress) external ;

    function getOffer(uint256 _tokenId)
        external 
        view
        returns (address seller, uint256 price, uint256 index, uint256 tokenId,uint64 time);
    function getAllTokenOnSale()
        external 
        view
        returns (uint256[] memory listOfOffers);
    function setOffer(uint256 _price, uint256 _tokenId) external ;

    function removeOffer(uint256 _tokenId) external ;
    function buyCat(uint256 _tokenId) external  payable;
}

contract CatMarketplace is ICatMarketplace{
    CatContract catContract;

    uint256[] private offersIds;
    struct Offer{
        uint256 tokenId;
        uint256 index;
        uint256 price;
        address payable seller;
        uint64 time;
    }
    mapping(uint256=>Offer) tokenIdsToOffer;

    function setCatContract(address _catContract) public override {
        CatContract temp = catContract;
        catContract = CatContract(_catContract);

        emit CatAddressUpdated(address(temp), address(_catContract));
    }
    function setOffer(uint256 _price, uint256 _tokenId) public override{
        require(msg.sender==catContract.ownerOf(_tokenId),"not owner ,cant sell");
        // catContract.ApprovalForAll(msg.sender, , _tokenId);

        //允许当前合约管理token NFT
        catContract.approve(address(this), _tokenId);

        Offer memory offer = Offer({
            tokenId:_tokenId,
            index:offersIds.length,
            price:_price,
            seller:payable(msg.sender),
            time:uint64(block.timestamp)
        });
        offersIds.push(_tokenId);
        tokenIdsToOffer[_tokenId] = offer;

        emit MarketTransaction("new offer",msg.sender,_tokenId);
    }
    function getOffer(uint256 _tokenId)
        public
        override
        view
        returns (address seller, uint256 price, uint256 index, uint256 tokenId, uint64 time){
            Offer memory offer = tokenIdsToOffer[_tokenId];
            return (offer.seller,offer.price,offer.index,offer.tokenId,offer.time);
        }
     function getAllTokenOnSale()
        public
        override
        view
        returns (uint256[] memory listOfOffers){
            return offersIds;
        }
    function removeOffer(uint256 _tokenId) public override {
        require(this.isOffer(_tokenId),"not in sell");
        // 合约控制可以需要控制删除
        // require(msg.sender==catContract.ownerOf(_tokenId),"not owner ,cant sell");

        uint256 arrayIndex = tokenIdsToOffer[_tokenId].index;
        uint256 lastIndex = offersIds.length-1;
        

        delete tokenIdsToOffer[_tokenId];

        if(arrayIndex!=lastIndex){
            //互换tokenId
            offersIds[arrayIndex] = offersIds[lastIndex];
            uint256 tempTokenId =  offersIds[arrayIndex];
            //替换tokenIdsToOffer的索引index数据
            tokenIdsToOffer[tempTokenId].index = arrayIndex;
        }
    
        offersIds.pop();

        emit MarketTransaction("Cancel offer", msg.sender, _tokenId);

    }
    function isOffer(uint256 _tokenId) external view returns (bool) {
        return tokenIdsToOffer[_tokenId].seller != address(0);
    }
    function buyCat(uint256 _tokenId) public override payable{
        Offer memory offer = tokenIdsToOffer[_tokenId];
        require(msg.value>=offer.price,"no enogth money");
        require(this.isOffer(_tokenId),"no in sell,can't buy");

        //下架
        removeOffer(_tokenId);
        //给seller转账
        offer.seller.transfer(offer.price);
        // payable(this).transfer()
        catContract.transferFrom(offer.seller, msg.sender, _tokenId);

        emit MarketTransaction("Buy", msg.sender, _tokenId);
    }
}
