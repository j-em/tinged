import { MenuItem, MenuItemConstructorOptions, remote } from "electron";
import { useEffect, useRef } from "react";

const useElectronMenu = (
  template: (MenuItem | MenuItemConstructorOptions)[]
) => {
  useEffect(() => {
    const menu = remote.Menu.buildFromTemplate(template);
    remote.Menu.setApplicationMenu(menu);
  }, [template.length]);
};

export default useElectronMenu;
