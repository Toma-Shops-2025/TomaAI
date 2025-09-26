import React, { useState } from 'react';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  disabled?: boolean;
}

const styles = [
  { 
    id: 'photorealistic', 
    name: 'Photorealistic', 
    description: 'Lifelike photos', 
    icon: '📸',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-t09OGgzeUa6vbfFMAkheSeCz.png?st=2025-09-26T00%3A11%3A30Z&se=2025-09-26T02%3A11%3A30Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=6e4237ed-4a31-4e1d-a677-4df21834ece0&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T07%3A37%3A50Z&ske=2025-09-26T07%3A37%3A50Z&sks=b&skv=2024-08-04&sig=sLMg0Ijg6gYS2Mo1SmwHehLzTtm01YY2x0ShH/M5ZZI%3D'
  },
  { 
    id: 'abstract', 
    name: 'Abstract', 
    description: 'Modern art', 
    icon: '🎨',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-JHo04O0fKz9QwA9lkOO9YfQQ.png?st=2025-09-26T00%3A26%3A39Z&se=2025-09-26T02%3A26%3A39Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=c6569cb0-0faa-463d-9694-97df3dc1dfb1&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T00%3A09%3A36Z&ske=2025-09-27T00%3A09%3A36Z&sks=b&skv=2024-08-04&sig=fAVZAryekPwnncK/Qtk7RK9xD9Tc7zhODHZbrhcane8%3D'
  },
  { 
    id: 'anime', 
    name: 'Anime', 
    description: 'Japanese animation', 
    icon: '🎌',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-QjYpTHTjNMsYkYstx2u9qVue.png?st=2025-09-26T00%3A30%3A04Z&se=2025-09-26T02%3A30%3A04Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=31d50bd4-689f-439b-a875-f22bd677744d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T08%3A34%3A02Z&ske=2025-09-26T08%3A34%3A02Z&sks=b&skv=2024-08-04&sig=WYm5/BsDm1uKvUHxa44Cup4%2BDE2Yc6iId%2BkO56igsiU%3D'
  },
  { 
    id: 'artistic', 
    name: 'Artistic', 
    description: 'Traditional art', 
    icon: '🖼️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-3focf5VLYqBQAbelcBtsH9u9.png?st=2025-09-26T00%3A33%3A13Z&se=2025-09-26T02%3A33%3A13Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=38e27a3b-6174-4d3e-90ac-d7d9ad49543f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T22%3A28%3A06Z&ske=2025-09-26T22%3A28%3A06Z&sks=b&skv=2024-08-04&sig=Pz6AqO01%2BiQZPaDnn7I3N3wLGSOBP9nQ/MHdgIbIxWE%3D'
  },
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    description: 'Futuristic neon', 
    icon: '🌃',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-4i4dDGOg0R9YlJvHFIWoDWUy.png?st=2025-09-26T00%3A41%3A33Z&se=2025-09-26T02%3A41%3A33Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=38e27a3b-6174-4d3e-90ac-d7d9ad49543f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T01%3A40%3A30Z&ske=2025-09-27T01%3A40%3A30Z&sks=b&skv=2024-08-04&sig=2/HNVaJBwSsASVQqXrpG2uUnVkVL3Cpw0owkrclgosI%3D'
  },
  { 
    id: 'fantasy', 
    name: 'Fantasy', 
    description: 'Magical worlds', 
    icon: '🧙‍♂️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-CoBT3D2cTwdaWkHwUpsSUts3.png?st=2025-09-26T00%3A43%3A42Z&se=2025-09-26T02%3A43%3A42Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=8eb2c87c-0531-4dab-acb3-b5e2adddce6c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T23%3A07%3A32Z&ske=2025-09-26T23%3A07%3A32Z&sks=b&skv=2024-08-04&sig=KxhKCFb%2BGgUI5chcMPMjyEQBQwiInalmpd0v078aELc%3D'
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    description: 'Retro classic', 
    icon: '📻',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-AcnGHYzVJpmXQT4mydocYPk1.png?st=2025-09-26T00%3A46%3A00Z&se=2025-09-26T02%3A46%3A00Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=31d50bd4-689f-439b-a875-f22bd677744d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T15%3A24%3A25Z&ske=2025-09-26T15%3A24%3A25Z&sks=b&skv=2024-08-04&sig=pq9HdqBBKWWoMebMpCi8Nk0XP2zL7DlT4yui/pM0aCQ%3D'
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    description: 'Clean & simple', 
    icon: '⚪',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-uAgLCKn8cC6hJ1WPve8WAbGK.png?st=2025-09-26T00%3A48%3A01Z&se=2025-09-26T02%3A48%3A01Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=0e2a3d55-e963-40c9-9c89-2a1aa28cb3ac&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T21%3A48%3A50Z&ske=2025-09-26T21%3A48%3A50Z&sks=b&skv=2024-08-04&sig=9UzMNvQxZUm3adNuYaTO4j/0P/4zxX3aL81y0QVyE4I%3D'
  },
  { 
    id: 'watercolor', 
    name: 'Watercolor', 
    description: 'Soft painting', 
    icon: '🎨',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-7IQ5hPoSj3IfWq0VwCweXGVX.png?st=2025-09-26T00%3A50%3A06Z&se=2025-09-26T02%3A50%3A06Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=38e27a3b-6174-4d3e-90ac-d7d9ad49543f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T22%3A51%3A24Z&ske=2025-09-26T22%3A51%3A24Z&sks=b&skv=2024-08-04&sig=Gg6U/MLlN1ZasyNLqsJk47OoKYT99Xj3U5Bdikeajqs%3D'
  },
  { 
    id: 'oil_painting', 
    name: 'Oil Painting', 
    description: 'Classical art', 
    icon: '🖌️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-BOszuB8uNjgnPvWXz5fMXBeV.png?st=2025-09-26T01%3A23%3A54Z&se=2025-09-26T03%3A23%3A54Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=c6569cb0-0faa-463d-9694-97df3dc1dfb1&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T00%3A19%3A36Z&ske=2025-09-27T00%3A19%3A36Z&sks=b&skv=2024-08-04&sig=X/0ISi4omg02q0Ga1JA4RDKqVzKgFJatvCRwi5WumBE%3D'
  },
  { 
    id: 'digital_art', 
    name: 'Digital Art', 
    description: 'Modern digital', 
    icon: '💻',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-5CTd2QX1As4hKIgcIId2FzLm.png?st=2025-09-26T00%3A54%3A55Z&se=2025-09-26T02%3A54%3A55Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=31d50bd4-689f-439b-a875-f22bd677744d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T23%3A48%3A00Z&ske=2025-09-26T23%3A48%3A00Z&sks=b&skv=2024-08-04&sig=hZmFn10IRAT8zMveMV3pxxq0ehK8VjIOxDiq%2BGGSMe8%3D'
  },
  { 
    id: 'sketch', 
    name: 'Sketch', 
    description: 'Hand-drawn', 
    icon: '✏️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-J3gpGgcQdu0qVBTl4RYtM3Er.png?st=2025-09-26T00%3A57%3A42Z&se=2025-09-26T02%3A57%3A42Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=0e2a3d55-e963-40c9-9c89-2a1aa28cb3ac&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T20%3A21%3A41Z&ske=2025-09-26T20%3A21%3A41Z&sks=b&skv=2024-08-04&sig=SHeeYucaa7fO99w/C2sLyiDV05VKbayUQn46p6qnNHc%3D'
  },
  { 
    id: 'pop_art', 
    name: 'Pop Art', 
    description: 'Bold & vibrant', 
    icon: '🟡',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-eJnjiA0mmyB2MisEADet95YM.png?st=2025-09-26T01%3A00%3A14Z&se=2025-09-26T03%3A00%3A14Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=32836cae-d25f-4fe9-827b-1c8c59c442cc&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-25T22%3A07%3A00Z&ske=2025-09-26T22%3A07%3A00Z&sks=b&skv=2024-08-04&sig=LBS2WIrnsKfVeVx6MivCl2oVm%2Bk%2BgFzwa1HiWfmWeVw%3D'
  },
  { 
    id: 'surreal', 
    name: 'Surreal', 
    description: 'Dreamlike', 
    icon: '🌙',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-FS0bABYcgvcPODb8eme8BjN8.png?st=2025-09-26T01%3A04%3A02Z&se=2025-09-26T03%3A04%3A02Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=8eb2c87c-0531-4dab-acb3-b5e2adddce6c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T01%3A26%3A46Z&ske=2025-09-27T01%3A26%3A46Z&sks=b&skv=2024-08-04&sig=FKwBF2kLeBlkQITt755QEWAKZ85rrv%2BE%2BmK0SfsS7fY%3D'
  },
  { 
    id: 'steampunk', 
    name: 'Steampunk', 
    description: 'Victorian tech', 
    icon: '⚙️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-TkBK6DTeHR31dXp4xdLrLcCy.png?st=2025-09-26T01%3A06%3A18Z&se=2025-09-26T03%3A06%3A18Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=32836cae-d25f-4fe9-827b-1c8c59c442cc&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T02%3A06%3A18Z&ske=2025-09-27T02%3A06%3A18Z&sks=b&skv=2024-08-04&sig=cmQq2r%2BBycqW%2BL%2BonBCG4QGVus%2BNSSXebepdK6Qguls%3D'
  },
  { 
    id: 'gothic', 
    name: 'Gothic', 
    description: 'Dark & dramatic', 
    icon: '🦇',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-51Ri1C6kZu3GbLUfb0r8bsb1.png?st=2025-09-26T01%3A08%3A13Z&se=2025-09-26T03%3A08%3A13Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=c6569cb0-0faa-463d-9694-97df3dc1dfb1&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T00%3A09%3A36Z&ske=2025-09-27T00%3A09%3A36Z&sks=b&skv=2024-08-04&sig=B5Q4ihbojoOE13WyvcTVvwPCveFYkEa6MSCc0LeDh1E%3D'
  },
  { 
    id: 'impressionist', 
    name: 'Impressionist', 
    description: 'Soft brushstrokes', 
    icon: '🌅',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-BNjOE3IepCT2FXSo26rFjI9y.png?st=2025-09-26T01%3A10%3A47Z&se=2025-09-26T03%3A10%3A47Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=31d50bd4-689f-439b-a875-f22bd677744d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T02%3A10%3A47Z&ske=2025-09-27T02%3A10%3A47Z&sks=b&skv=2024-08-04&sig=rWGYzZpce9AcpJ4k64SllEfIA8HvhkoiJV5YSE5NDBY%3D'
  },
  { 
    id: 'cartoon', 
    name: 'Cartoon', 
    description: 'Animated style', 
    icon: '🎭',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-Z8W4KFuGZ5py2HuxW14FEMs7.png?st=2025-09-26T01%3A15%3A54Z&se=2025-09-26T03%3A15%3A54Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=0e2a3d55-e963-40c9-9c89-2a1aa28cb3ac&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T00%3A39%3A10Z&ske=2025-09-27T00%3A39%3A10Z&sks=b&skv=2024-08-04&sig=WRadi36IOLIrVMvfaFGy9u/li3kceBhirzS%2Bk/i3aWE%3D'
  },
  { 
    id: 'realistic_portrait', 
    name: 'Portrait', 
    description: 'Professional headshot', 
    icon: '👤',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-vAzhYueVqGjIatuKnPvrM1Ws.png?st=2025-09-26T01%3A18%3A28Z&se=2025-09-26T03%3A18%3A28Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=6e4237ed-4a31-4e1d-a677-4df21834ece0&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T01%3A31%3A54Z&ske=2025-09-27T01%3A31%3A54Z&sks=b&skv=2024-08-04&sig=Isbb2QJQlzpdHd1W0SUVGkvthGgFrz5FdYFrJRaUl/A%3D'
  },
  { 
    id: 'landscape', 
    name: 'Landscape', 
    description: 'Nature scenes', 
    icon: '🏞️',
    sampleImage: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-QXOBKz7Ak83yrlkmN2QPsVHf/user-HiWMbo4wtP29VfygmsRhGNsD/img-KJTnyM4AsMzjO3CrGOmh7gGs.png?st=2025-09-26T01%3A20%3A15Z&se=2025-09-26T03%3A20%3A15Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=c6569cb0-0faa-463d-9694-97df3dc1dfb1&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-26T00%3A24%3A03Z&ske=2025-09-27T00%3A24%3A03Z&sks=b&skv=2024-08-04&sig=nCl25HJFNKt/zhYWSN3QncnvpjcN2mKtmGwufi8fRz8%3D'
  }
];

export default function StyleSelector({ selectedStyle, onStyleChange, disabled = false }: StyleSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedStyles = showAll ? styles : styles.slice(0, 8);

  // Helper function to update a style's sample image
  const updateStyleImage = (styleId: string, newImageUrl: string) => {
    // This would be called when you want to replace a style's sample image
    console.log(`Updating ${styleId} with new image: ${newImageUrl}`);
    // You can call this function after generating each image
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold text-lg mb-4">Choose a Style</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {displayedStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            disabled={disabled}
            className={`relative overflow-hidden rounded-lg text-left transition-all duration-200 ${
              selectedStyle === style.id
                ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900'
                : 'hover:scale-105'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="relative">
              <img 
                src={style.sampleImage} 
                alt={style.name}
                className="w-full h-24 object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                selectedStyle === style.id 
                  ? 'from-cyan-600/80 to-blue-600/80' 
                  : 'from-black/60 to-transparent'
              }`} />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="text-white font-medium text-sm">{style.name}</div>
                <div className="text-white/80 text-xs">{style.description}</div>
              </div>
              {selectedStyle === style.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          disabled={disabled}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
        >
          Show All Styles ({styles.length - 8} more)
        </button>
      )}
      
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          disabled={disabled}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
        >
          Show Less
        </button>
      )}
    </div>
  );
}