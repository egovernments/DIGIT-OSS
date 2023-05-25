import get from "lodash/get"

const subCategoriesInOwnersType = ["INDIVIDUAL"]

const formDropdown = category => {
  const { name, code } = category
  return {
    label: name,
    value: code,
  }
}

export const getOwnerDetails = state => {
  const { OwnerShipCategory, SubOwnerShipCategory } = JSON.parse(JSON.stringify(state.common.generalMDMSDataById))
  const ownerShipdropDown = []
  Object.keys(OwnerShipCategory).forEach((category) => {
    const categoryCode = OwnerShipCategory[category].code
    if (subCategoriesInOwnersType.indexOf(categoryCode) !== -1) {
      Object.keys(SubOwnerShipCategory)
        .filter(subCategory => categoryCode === SubOwnerShipCategory[subCategory].ownerShipCategory)
        .forEach(linkedCategory => {
          ownerShipdropDown.push(formDropdown(SubOwnerShipCategory[linkedCategory]))
        })
    } else {
      ownerShipdropDown.push(formDropdown(OwnerShipCategory[category]))
    }
  })
  return ownerShipdropDown
}

export const updateInstituteType = (state, value) => {
  const { SubOwnerShipCategory } = get(state, "common.generalMDMSDataById", {})
  const institutedropDown = []
  Object.keys(SubOwnerShipCategory)
    .filter(subCategory => SubOwnerShipCategory[subCategory].ownerShipCategory === value)
    .forEach(linkedCategory => {
      institutedropDown.push(formDropdown(SubOwnerShipCategory[linkedCategory]))
    })
  return institutedropDown
}
