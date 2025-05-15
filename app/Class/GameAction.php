<?php

namespace App\Class;

use Illuminate\Http\Request;

/**
 * An action which can be called through different means.
 */
class GameAction {
    public function __construct(
        public string $name,
        public mixed $action,
    ) {}

    /**
     * Executes this game action using data from a http request.
     * 
     * @throws \ReflectionException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function doUsingRequest(Request $request, GameState $gameState): array {
        $functionReflection = new \ReflectionFunction($this->action);

        $validationRules = [];
        foreach ($functionReflection->getParameters() as $functionParameter) {
            $rule = [
                $functionParameter->getType()->allowsNull() ? 'nullable' : 'required',
            ];

            switch ($functionParameter->getType()->__toString()) {
                case 'string':
                    $rule[] = 'string';
                    break;
                case 'int':
                    $rule[] = 'numeric';
                    break;
                case 'bool':
                    $rule[] = 'boolean';
                    break;
                case 'array':
                    $rule[] = 'array';
                    break;
            }

            if (count(array_keys($rule)) == 1) continue;

            $validationRules[$functionParameter->getName()] = $rule;
        }

        $body = $request->validate($validationRules);

        $func = $this->action;
        $result = $func($gameState, ...array_values($body));

        return $result;
    }
}