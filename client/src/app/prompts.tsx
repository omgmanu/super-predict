import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

export function Prompts() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-heading mb-10 mt-6 text-center">Prompts list</h1>
        <div className="flex items-center gap-8 max-w-4xl mx-auto">
          <h3 className="text-lg font-heading mb-4 w-[70%]">
            Here you'll find the prompts and files used by Cursor AI and{' '}
            <a
              className="text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.anthropic.com/news/claude-3-7-sonnet"
            >
              Claude-3.7-sonnet (from Anthropic)
            </a>{' '}
            to assist in developing this project. These include context files,
            development instructions, and AI interactions that helped shape the
            application's features and functionality.
          </h3>
          <img
            src="/chats.png"
            alt="AI Assistant"
            className="w-[30%] object-contain"
          />
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full gap-4 flex flex-col mt-10"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>1. Project Init</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-lg font-heading mb-4">
                Starting prompt file:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/blob/main/prompts/instructions/project-init.MD"
                >
                  project-init.MD
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Github commit:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/commit/ba067ef06e99b01f1a56a8ce9252f6dbb1128cf3"
                >
                  feat: project init
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Html export<span className="text-sm">*</span>:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://super-predict.b-cdn.net/cursor-export/project-init.html"
                >
                  project-init.html
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">Cursor chat video:</h3>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/403092/8df38bcc-0bc9-4147-a82d-f6bbc629a6d8?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
              <p className="text-xs pt-4">
                * HTML export made with{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                  href="https://github.com/abakermi/vscode-cursorchat-downloader"
                >
                  vscode-cursorchat-downloader
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>2. Styling client</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-lg font-heading mb-4">
                Starting prompt file:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/blob/main/prompts/instructions/styling-client.MD"
                >
                  styling-client.MD
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Github commit:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/commit/6404c4ae8a1ce1cad6d63ba1c0b2fd1ed463dce8"
                >
                  feat: client styling and structure
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Html export<span className="text-sm">*</span>:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://super-predict.b-cdn.net/cursor-export/client-development.html"
                >
                  client-development.html
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">Cursor chat video:</h3>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/403092/c10ba06b-89b1-443e-ab84-4b449bc69dcb?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
              <p className="text-xs pt-4">
                * HTML export made with{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                  href="https://github.com/abakermi/vscode-cursorchat-downloader"
                >
                  vscode-cursorchat-downloader
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>3. Developing API</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-lg font-heading mb-4">
                Starting prompt file:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/blob/main/prompts/instructions/developing-api.MD"
                >
                  developing-api.MD
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Github commit:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/commit/e28acb3876698c0eecc6bb4f7ca4a7efb827d9b3"
                >
                  feat: develop api & game logic
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Html export<span className="text-sm">*</span>:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://super-predict.b-cdn.net/cursor-export/api-development.html"
                >
                  api-development.html
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">Cursor chat video:</h3>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/403092/fc54b6d5-9cfd-413c-bb25-5ecef2e9b3f4?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
              <p className="text-xs pt-4">
                * HTML export made with{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                  href="https://github.com/abakermi/vscode-cursorchat-downloader"
                >
                  vscode-cursorchat-downloader
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>4. Game logic</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-lg font-heading mb-4">
                Starting prompt file:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/blob/main/prompts/instructions/game-logic-development.MD"
                >
                  game-logic-development.MD
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Github commit:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/commit/e28acb3876698c0eecc6bb4f7ca4a7efb827d9b3"
                >
                  feat: develop api & game logic
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Html export<span className="text-sm">*</span>:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://super-predict.b-cdn.net/cursor-export/game-logic.html"
                >
                  game-logic.html
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">Cursor chat video:</h3>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/403092/3e2cffe1-41e6-4079-807d-5fb2ba65a60e?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
              <p className="text-xs pt-4">
                * HTML export made with{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                  href="https://github.com/abakermi/vscode-cursorchat-downloader"
                >
                  vscode-cursorchat-downloader
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>5. Leaderboard</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-lg font-heading mb-4">
                Starting prompt file:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/blob/main/prompts/instructions/leaderboard-development.MD"
                >
                  leaderboard-development.MD
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Github commit:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/commit/20dd27a6f6b52be9bf2d3d34d45790b4c39a8138"
                >
                  feat: leaderboard development
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Html export<span className="text-sm">*</span>:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://super-predict.b-cdn.net/cursor-export/leaderboard-development.html"
                >
                  leaderboard-development.html
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">Cursor chat video:</h3>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/403092/03355c6d-f102-4f16-bd4f-ce9401ca629c?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
              <p className="text-xs pt-4">
                * HTML export made with{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                  href="https://github.com/abakermi/vscode-cursorchat-downloader"
                >
                  vscode-cursorchat-downloader
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>6. Pending game facts</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-lg font-heading mb-4">
                Starting prompt file:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/blob/main/prompts/instructions/pending-game-facts.MD"
                >
                  pending-game-facts.MD
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Github commit:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/commit/641d56a25f140d1b0501d0b37677f0b73b566314"
                >
                  feat: game boosts & pending game facts
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Html export<span className="text-sm">*</span>:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://super-predict.b-cdn.net/cursor-export/pending-game-facts.html"
                >
                  pending-game-facts.html
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">Cursor chat video:</h3>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/403092/31e6a2fb-88cc-4859-a7ec-ea7c4213baa5?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
              <p className="text-xs pt-4">
                * HTML export made with{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                  href="https://github.com/abakermi/vscode-cursorchat-downloader"
                >
                  vscode-cursorchat-downloader
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>7. Game boosts development</AccordionTrigger>
            <AccordionContent>
              <h3 className="text-lg font-heading mb-4">
                Starting prompt file:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/blob/main/prompts/instructions/game-boosts-development.MD"
                >
                  game-boosts-development.MD
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Github commit:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/omgmanu/super-predict/commit/641d56a25f140d1b0501d0b37677f0b73b566314"
                >
                  feat: game boosts & pending game facts
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">
                Html export<span className="text-sm">*</span>:{' '}
                <a
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://super-predict.b-cdn.net/cursor-export/game-boosts-development.html"
                >
                  game-boosts-development.html
                </a>
              </h3>
              <h3 className="text-lg font-heading mb-4">Cursor chat video:</h3>
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/403092/44fad12f-573f-4a1d-8f5f-73435bd465e3?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
                  loading="lazy"
                  style={{
                    border: 0,
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
              <p className="text-xs pt-4">
                * HTML export made with{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                  href="https://github.com/abakermi/vscode-cursorchat-downloader"
                >
                  vscode-cursorchat-downloader
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default Prompts;
